import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
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
        setSucesso('Dados do cliente atualizados com sucesso!');
      } else {
        await api.criarCliente(payload);
        setSucesso('Novo cliente cadastrado com sucesso!');
      }
      setModalAberto(false);
      carregarClientes();
    } catch (err) {
      setErro(err.message);
    }
  };

  const handleExcluir = async (id, nome) => {
    if (!window.confirm(`Deseja realmente excluir o cliente "${nome}"?`)) return;
    setErro('');
    setSucesso('');
    try {
      await api.excluirCliente(id);
      setSucesso('Cliente removido com sucesso.');
      carregarClientes();
    } catch (err) {
      setErro(err.message);
    }
  };

  const calcularSomaRendimentos = (rendimentos = []) =>
    rendimentos.reduce((acc, r) => acc + Number(r.valorRendimento || 0), 0);

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">👥 Gestão de Contratantes (CRUD de Clientes)</h2>
            <p className="card-subtitle">
              Armazena dados de identificação (RG, CPF, Nome, Endereço), profissão e até 3 entidades empregadoras e respectivos rendimentos.
            </p>
          </div>
          <button className="btn btn-primary" onClick={abrirNovo}>
            + Novo Cliente
          </button>
        </div>

        {erro && <div className="alert alert-error">{erro}</div>}
        {sucesso && <div className="alert alert-success">{sucesso}</div>}

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Contratante / Login</th>
                <th>RG / CPF</th>
                <th>Profissão & Endereço</th>
                <th>Entidades Empregadoras e Rendimentos (Máx. 3)</th>
                <th>Renda Total</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((c) => {
                const total = calcularSomaRendimentos(c.rendimentos);
                return (
                  <tr key={c.id}>
                    <td>#{c.id}</td>
                    <td>
                      <strong>{c.nome}</strong>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>@{c.username}</div>
                    </td>
                    <td>
                      <div><strong>CPF:</strong> {c.cpf}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>RG: {c.rg}</div>
                    </td>
                    <td>
                      <span className="badge badge-info">{c.profissao}</span>
                      <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '0.25rem' }}>
                        📍 {c.endereco}
                      </div>
                    </td>
                    <td>
                      {c.rendimentos && c.rendimentos.length > 0 ? (
                        <ul style={{ listStyle: 'none', fontSize: '0.82rem' }}>
                          {c.rendimentos.map((r, i) => (
                            <li key={i} style={{ marginBottom: '0.2rem' }}>
                              🏢 <strong>{r.entidadeEmpregadora}:</strong>{' '}
                              R$ {Number(r.valorRendimento).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '0.82rem' }}>Sem rendimentos</span>
                      )}
                    </td>
                    <td>
                      <strong style={{ color: '#15803d' }}>
                        R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </strong>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button className="btn btn-outline btn-sm" onClick={() => abrirEdicao(c)}>
                          ✏️ Editar
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleExcluir(c.id, c.nome)}>
                          🗑️ Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {clientes.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                    Nenhum cliente cadastrado.
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
                {editandoId ? `✏️ Editar Cliente #${editandoId}` : '➕ Cadastrar Novo Cliente'}
              </h3>
              <button className="btn btn-outline btn-sm" onClick={() => setModalAberto(false)}>
                ✕ Fechar
              </button>
            </div>

            {erro && <div className="alert alert-error">{erro}</div>}

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
                    className="form-control"
                    value={form.rg}
                    onChange={(e) => setForm({ ...form, rg: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>CPF *</label>
                  <input
                    className="form-control"
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
                  <label>{editandoId ? 'Nova Senha (deixe em branco para manter)' : 'Senha *'}</label>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                  <label style={{ fontSize: '0.88rem', fontWeight: 700 }}>
                    💼 Entidades Empregadoras e Rendimentos (Máx. 3)
                  </label>
                  {form.rendimentos.length < 3 && (
                    <button type="button" className="btn btn-outline btn-sm" onClick={adicionarRendimento}>
                      + Adicionar ({form.rendimentos.length}/3)
                    </button>
                  )}
                </div>

                {form.rendimentos.map((r, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input
                      className="form-control"
                      style={{ flex: 2 }}
                      placeholder={`Entidade Empregadora #${idx + 1}`}
                      value={r.entidadeEmpregadora}
                      onChange={(e) => atualizarRendimento(idx, 'entidadeEmpregadora', e.target.value)}
                      required
                    />
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="form-control"
                      style={{ flex: 1 }}
                      placeholder="Rendimento (R$)"
                      value={r.valorRendimento}
                      onChange={(e) => atualizarRendimento(idx, 'valorRendimento', e.target.value)}
                      required
                    />
                    {form.rendimentos.length > 1 && (
                      <button type="button" className="btn btn-danger btn-sm" onClick={() => removerRendimento(idx)}>
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setModalAberto(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  💾 Salvar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

