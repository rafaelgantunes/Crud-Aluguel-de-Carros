import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import {
  UsersIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  BriefcaseIcon,
  MapPinIcon,
  SearchIcon,
  DollarSignIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  XCircleIcon,
} from '../components/Icons';

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [busca, setBusca] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [editandoId, setEditandoId] = useState(null);

  const formInicial = {
    username: '',
    senha: '',
    nome: '',
    rg: '',
    cpf: '',
    endereco: '',
    profissao: '',
    rendimentos: [{ entidadeEmpregadora: '', valorRendimento: '' }],
  };
  const [form, setForm] = useState(formInicial);

  const carregarClientes = async () => {
    try {
      const lista = await api.listarClientes();
      setClientes(lista);
    } catch (err) {
      setErro(err.message);
    }
  };

  useEffect(() => {
    carregarClientes();
  }, []);

  const abrirNovo = () => {
    setEditandoId(null);
    setForm(formInicial);
    setErro('');
    setModalAberto(true);
  };

  const abrirEdicao = (cliente) => {
    setEditandoId(cliente.id);
    setForm({
      username: cliente.username || '',
      senha: '',
      nome: cliente.nome || '',
      rg: cliente.rg || '',
      cpf: cliente.cpf || '',
      endereco: cliente.endereco || '',
      profissao: cliente.profissao || '',
      rendimentos:
        cliente.rendimentos && cliente.rendimentos.length > 0
          ? cliente.rendimentos.map((r) => ({
              entidadeEmpregadora: r.entidadeEmpregadora,
              valorRendimento: r.valorRendimento,
            }))
          : [{ entidadeEmpregadora: '', valorRendimento: '' }],
    });
    setErro('');
    setModalAberto(true);
  };

  const adicionarRendimento = () => {
    if (form.rendimentos.length >= 3) return;
    setForm({
      ...form,
      rendimentos: [...form.rendimentos, { entidadeEmpregadora: '', valorRendimento: '' }],
    });
  };

  const removerRendimento = (idx) => {
    setForm({
      ...form,
      rendimentos: form.rendimentos.filter((_, i) => i !== idx),
    });
  };

  const atualizarRendimento = (idx, campo, valor) => {
    const copia = [...form.rendimentos];
    copia[idx][campo] = valor;
    setForm({ ...form, rendimentos: copia });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');
    try {
      const payload = {
        ...form,
        rendimentos: form.rendimentos
          .filter((r) => r.entidadeEmpregadora.trim() !== '' && r.valorRendimento !== '')
          .map((r) => ({
            entidadeEmpregadora: r.entidadeEmpregadora,
            valorRendimento: Number(r.valorRendimento),
          })),
      };

      if (editandoId) {
        await api.atualizarCliente(editandoId, payload);
        setSucesso('Cadastro do contratante atualizado com sucesso.');
      } else {
        await api.criarCliente(payload);
        setSucesso('Novo contratante registrado com sucesso.');
      }
      setModalAberto(false);
      carregarClientes();
    } catch (err) {
      setErro(err.message);
    }
  };

  const handleExcluir = async (id, nome) => {
    if (!window.confirm(`Deseja realmente excluir o contratante "${nome}"?`)) return;
    setErro('');
    setSucesso('');
    try {
      await api.excluirCliente(id);
      setSucesso('Contratante removido com sucesso.');
      carregarClientes();
    } catch (err) {
      setErro(err.message);
    }
  };

  const calcularSomaRendimentos = (rendimentos = []) =>
    rendimentos.reduce((acc, r) => acc + Number(r.valorRendimento || 0), 0);

  const clientesFiltrados = clientes.filter((c) => {
    const termo = busca.toLowerCase();
    return (
      c.nome?.toLowerCase().includes(termo) ||
      c.cpf?.toLowerCase().includes(termo) ||
      c.profissao?.toLowerCase().includes(termo) ||
      c.username?.toLowerCase().includes(termo)
    );
  });

  const rendaTotalBase = clientes.reduce(
    (acc, c) => acc + calcularSomaRendimentos(c.rendimentos),
    0
  );
  const totalVinculos = clientes.reduce(
    (acc, c) => acc + (c.rendimentos ? c.rendimentos.length : 0),
    0
  );

  return (
    <div>
      {/* KPI Bento Grid */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div>
            <div className="kpi-label">Contratantes Ativos</div>
            <div className="kpi-value">{clientes.length}</div>
            <div className="kpi-sub">Cadastros completos verificados</div>
          </div>
          <div className="kpi-icon blue">
            <UsersIcon size={22} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-label">Vínculos Empregatícios</div>
            <div className="kpi-value">{totalVinculos}</div>
            <div className="kpi-sub">Limite de até 3 por contratante</div>
          </div>
          <div className="kpi-icon purple">
            <BriefcaseIcon size={22} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-label">Massa de Rendimentos</div>
            <div className="kpi-value">
              R$ {rendaTotalBase.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="kpi-sub">Base mensal para análise de crédito</div>
          </div>
          <div className="kpi-icon green">
            <DollarSignIcon size={22} />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title-group">
            <div className="kpi-icon blue">
              <UsersIcon size={20} />
            </div>
            <div>
              <h2 className="card-title">Gestão de Contratantes (CRUD de Clientes)</h2>
              <p className="card-subtitle">
                Identificação civil (RG, CPF, Nome, Endereço), profissão e até 3 entidades empregadoras com rendimentos auferidos.
              </p>
            </div>
          </div>
          <button type="button" className="btn btn-primary" onClick={abrirNovo}>
            <PlusIcon size={17} />
            <span>Novo Contratante</span>
          </button>
        </div>

        {erro && (
          <div className="alert alert-error">
            <AlertCircleIcon size={18} />
            <span>{erro}</span>
          </div>
        )}
        {sucesso && (
          <div className="alert alert-success">
            <CheckCircleIcon size={18} />
            <span>{sucesso}</span>
          </div>
        )}

        <div className="toolbar">
          <div className="search-box">
            <SearchIcon size={16} />
            <input
              type="text"
              className="search-input"
              placeholder="Buscar por nome, CPF, profissão ou usuário..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Exibindo <strong>{clientesFiltrados.length}</strong> de {clientes.length} registros
          </span>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Contratante</th>
                <th>Documentação</th>
                <th>Profissão &amp; Endereço</th>
                <th>Entidades Empregadoras (Máx. 3)</th>
                <th>Renda Total</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientesFiltrados.map((c) => {
                const total = calcularSomaRendimentos(c.rendimentos);
                return (
                  <tr key={c.id}>
                    <td data-label="ID" className="mono" style={{ color: '#64748b' }}>
                      #{c.id}
                    </td>
                    <td data-label="Contratante">
                      <strong style={{ color: '#0f172a', fontWeight: 600 }}>{c.nome}</strong>
                      <div className="mono" style={{ fontSize: '0.76rem', color: '#64748b' }}>
                        @{c.username}
                      </div>
                    </td>
                    <td data-label="Documentação" className="mono">
                      <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{c.cpf}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>RG: {c.rg}</div>
                    </td>
                    <td data-label="Profissão & Endereço">
                      <span className="badge badge-info">
                        <span className="badge-dot" />
                        {c.profissao}
                      </span>
                      <div
                        style={{
                          fontSize: '0.78rem',
                          color: '#475569',
                          marginTop: '0.35rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                        }}
                      >
                        <MapPinIcon size={14} />
                        <span>{c.endereco}</span>
                      </div>
                    </td>
                    <td data-label="Entidades Empregadoras (Máx. 3)">
                      {c.rendimentos && c.rendimentos.length > 0 ? (
                        <ul style={{ listStyle: 'none', fontSize: '0.8rem' }}>
                          {c.rendimentos.map((r, i) => (
                            <li
                              key={i}
                              style={{
                                marginBottom: '0.25rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                              }}
                            >
                              <BriefcaseIcon size={13} />
                              <span>
                                <strong>{r.entidadeEmpregadora}:</strong>{' '}
                                <span className="tabular">
                                  R${' '}
                                  {Number(r.valorRendimento).toLocaleString('pt-BR', {
                                    minimumFractionDigits: 2,
                                  })}
                                </span>
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                          Sem vínculos informados
                        </span>
                      )}
                    </td>
                    <td data-label="Renda Total" className="tabular">
                      <strong style={{ color: '#059669', fontSize: '0.92rem' }}>
                        R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </strong>
                    </td>
                    <td data-label="Ações">
                      <div className="table-actions">
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => abrirEdicao(c)}
                        >
                          <EditIcon size={14} />
                          <span>Editar</span>
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger-ghost btn-sm"
                          onClick={() => handleExcluir(c.id, c.nome)}
                        >
                          <TrashIcon size={14} />
                          <span>Excluir</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {clientesFiltrados.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                    Nenhum contratante encontrado para o filtro informado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalAberto && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="card-header">
              <h3 className="card-title">
                {editandoId ? `Editar Contratante #${editandoId}` : 'Cadastrar Novo Contratante'}
              </h3>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setModalAberto(false)}
              >
                <XCircleIcon size={15} />
                <span>Fechar</span>
              </button>
            </div>

            {erro && (
              <div className="alert alert-error">
                <AlertCircleIcon size={18} />
                <span>{erro}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid-2">
                <div className="form-group">
                  <label>Nome Completo *</label>
                  <input
                    className="form-control"
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Profissão *</label>
                  <input
                    className="form-control"
                    value={form.profissao}
                    onChange={(e) => setForm({ ...form, profissao: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>RG *</label>
                  <input
                    className="form-control mono"
                    value={form.rg}
                    onChange={(e) => setForm({ ...form, rg: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>CPF *</label>
                  <input
                    className="form-control mono"
                    value={form.cpf}
                    onChange={(e) => setForm({ ...form, cpf: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Endereço Completo *</label>
                <input
                  className="form-control"
                  value={form.endereco}
                  onChange={(e) => setForm({ ...form, endereco: e.target.value })}
                  required
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label>Usuário (Username) *</label>
                  <input
                    className="form-control"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>{editandoId ? 'Nova Senha (opcional)' : 'Senha *'}</label>
                  <input
                    type="password"
                    className="form-control"
                    value={form.senha}
                    onChange={(e) => setForm({ ...form, senha: e.target.value })}
                    required={!editandoId}
                  />
                </div>
              </div>

              <div className="rendimento-box">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.65rem',
                  }}
                >
                  <label
                    style={{
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    <BriefcaseIcon size={16} />
                    <span>Entidades Empregadoras e Rendimentos (Máx. 3)</span>
                  </label>
                  {form.rendimentos.length < 3 && (
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={adicionarRendimento}
                    >
                      <PlusIcon size={14} />
                      <span>Adicionar ({form.rendimentos.length}/3)</span>
                    </button>
                  )}
                </div>

                {form.rendimentos.map((r, idx) => (
                  <div key={idx} className="rendimento-row">
                    <input
                      className="form-control"
                      style={{ flex: 2 }}
                      placeholder={`Entidade Empregadora #${idx + 1}`}
                      value={r.entidadeEmpregadora}
                      onChange={(e) =>
                        atualizarRendimento(idx, 'entidadeEmpregadora', e.target.value)
                      }
                      required
                    />
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="form-control tabular"
                      style={{ flex: 1 }}
                      placeholder="Rendimento (R$)"
                      value={r.valorRendimento}
                      onChange={(e) => atualizarRendimento(idx, 'valorRendimento', e.target.value)}
                      required
                    />
                    {form.rendimentos.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-danger-ghost btn-sm"
                        onClick={() => removerRendimento(idx)}
                      >
                        <TrashIcon size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '0.5rem',
                  marginTop: '1.25rem',
                }}
              >
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setModalAberto(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircleIcon size={16} />
                  <span>Salvar Contratante</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
