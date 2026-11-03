import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  FileTextIcon,
  PlusIcon,
  EditIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  CalendarIcon,
  SearchIcon,
  DollarSignIcon,
  AlertCircleIcon,
  BankIcon,
  BuildingIcon,
  UserIcon,
} from '../components/Icons';

export default function PedidosPage() {
  const { usuario, isCliente, isAgente } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [automoveis, setAutomoveis] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [bancos, setBancos] = useState([]);
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('TODOS');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  // Modal Introduzir / Modificar Pedido
  const [modalPedido, setModalPedido] = useState(false);
  const [editandoPedidoId, setEditandoPedidoId] = useState(null);
  const [pedidoForm, setPedidoForm] = useState({
    clienteId: '',
    automovelId: '',
    dataInicio: '',
    dataFim: '',
    tipoContrato: 'PADRAO_EMPRESA',
    observacoesCliente: '',
  });

  // Modal Avaliação Financeira (Agente Empresa ou Banco)
  const [modalAvaliacao, setModalAvaliacao] = useState(false);
  const [pedidoEmAvaliacao, setPedidoEmAvaliacao] = useState(null);
  const [avaliacaoForm, setAvaliacaoForm] = useState({
    parecerPositivo: true,
    parecerFinanceiro: '',
    concederContratoCredito: false,
    bancoAgenteId: '',
    taxaJurosMensal: 1.49,
    quantidadeParcelas: 12,
  });

  const carregarDados = async () => {
    try {
      const [listaPedidos, listaAutos, listaClientes, listaBancos] = await Promise.all([
        api.listarPedidos(isCliente ? usuario.id : null),
        api.listarAutomoveis(),
        api.listarClientes(),
        api.listarBancos(),
      ]);
      setPedidos(listaPedidos);
      setAutomoveis(listaAutos);
      setClientes(listaClientes);
      setBancos(listaBancos);
    } catch (err) {
      setErro(err.message);
    }
  };

  useEffect(() => {
    carregarDados();
  }, [usuario]);

  const abrirNovoPedido = () => {
    setEditandoPedidoId(null);
    const hoje = new Date();
    const inicio = new Date(hoje.getTime() + 86400000).toISOString().split('T')[0];
    const fim = new Date(hoje.getTime() + 5 * 86400000).toISOString().split('T')[0];

    setPedidoForm({
      clienteId: isCliente ? usuario.id : clientes[0]?.id || '',
      automovelId: automoveis[0]?.id || '',
      dataInicio: inicio,
      dataFim: fim,
      tipoContrato: 'PADRAO_EMPRESA',
      observacoesCliente: '',
    });
    setErro('');
    setModalPedido(true);
  };

  const abrirModificarPedido = (pedido) => {
    setEditandoPedidoId(pedido.id);
    setPedidoForm({
      clienteId: pedido.cliente?.id || '',
      automovelId: pedido.automovel?.id || '',
      dataInicio: pedido.dataInicio,
      dataFim: pedido.dataFim,
      tipoContrato: pedido.tipoContrato,
      observacoesCliente: pedido.observacoesCliente || '',
    });
    setErro('');
    setModalPedido(true);
  };

  const handleSalvarPedido = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');
    try {
      const payload = {
        ...pedidoForm,
        clienteId: Number(pedidoForm.clienteId),
        automovelId: Number(pedidoForm.automovelId),
      };
      if (editandoPedidoId) {
        await api.modificarPedido(editandoPedidoId, payload);
        setSucesso('Pedido de aluguel modificado com sucesso.');
      } else {
        await api.introduzirPedido(payload);
        setSucesso('Novo pedido de aluguel introduzido e encaminhado para análise financeira.');
      }
      setModalPedido(false);
      carregarDados();
    } catch (err) {
      setErro(err.message);
    }
  };

  const abrirModalAvaliacao = (pedido) => {
    setPedidoEmAvaliacao(pedido);
    setAvaliacaoForm({
      parecerPositivo: true,
      parecerFinanceiro:
        pedido.parecerFinanceiro ||
        'Parecer favorável: Renda mensal comprovada compatível com o valor do contrato.',
      concederContratoCredito: pedido.tipoContrato === 'CREDITO_BANCO',
      bancoAgenteId: bancos[0]?.id || usuario.id,
      taxaJurosMensal: 1.49,
      quantidadeParcelas: 12,
    });
    setErro('');
    setModalAvaliacao(true);
  };

  const handleAvaliarPedido = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');
    try {
      await api.avaliarPedido(pedidoEmAvaliacao.id, {
        agenteId: usuario.id,
        parecerPositivo: avaliacaoForm.parecerPositivo,
        parecerFinanceiro: avaliacaoForm.parecerFinanceiro,
        concederContratoCredito: avaliacaoForm.concederContratoCredito,
        bancoAgenteId: avaliacaoForm.bancoAgenteId ? Number(avaliacaoForm.bancoAgenteId) : null,
        taxaJurosMensal: Number(avaliacaoForm.taxaJurosMensal),
        quantidadeParcelas: Number(avaliacaoForm.quantidadeParcelas),
      });
      setSucesso('Parecer financeiro registrado com sucesso.');
      setModalAvaliacao(false);
      carregarDados();
    } catch (err) {
      setErro(err.message);
    }
  };

  const handleExecutarContrato = async (pedidoId) => {
    setErro('');
    setSucesso('');
    try {
      await api.executarContrato(pedidoId);
      setSucesso(
        'Contrato executado com sucesso. O registro de propriedade do veículo foi atualizado.'
      );
      carregarDados();
    } catch (err) {
      setErro(err.message);
    }
  };

  const handleCancelarPedido = async (pedidoId) => {
    if (!window.confirm('Tem certeza que deseja cancelar este pedido de aluguel?')) return;
    setErro('');
    setSucesso('');
    try {
      await api.cancelarPedido(pedidoId);
      setSucesso('Pedido cancelado com sucesso.');
      carregarDados();
    } catch (err) {
      setErro(err.message);
    }
  };

  const renderBadgeStatus = (status) => {
    switch (status) {
      case 'AGUARDANDO_ANALISE':
        return (
          <span className="badge badge-warning">
            <ClockIcon size={13} />
            <span>Aguardando Análise Financeira</span>
          </span>
        );
      case 'APROVADO_AGUARDANDO_CONTRATO':
        return (
          <span className="badge badge-info">
            <ShieldCheckIcon size={13} />
            <span>Parecer Positivo (Pronto p/ Contrato)</span>
          </span>
        );
      case 'CONTRATO_EXECUTADO':
        return (
          <span className="badge badge-success">
            <CheckCircleIcon size={13} />
            <span>Contrato Executado</span>
          </span>
        );
      case 'REJEITADO':
        return (
          <span className="badge badge-danger">
            <XCircleIcon size={13} />
            <span>Parecer Negativo</span>
          </span>
        );
      case 'CANCELADO':
        return (
          <span className="badge badge-danger">
            <XCircleIcon size={13} />
            <span>Cancelado</span>
          </span>
        );
      default:
        return <span className="badge badge-info">{status}</span>;
    }
  };

  const renderModalidade = (tipo) => {
    if (tipo === 'CREDITO_BANCO') {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontSize: '0.77rem',
            color: '#6d28d9',
            fontWeight: 600,
          }}
        >
          <BankIcon size={14} />
          <span>Crédito Bancário (Propriedade Banco)</span>
        </span>
      );
    }
    if (tipo === 'PROPRIEDADE_CLIENTE') {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontSize: '0.77rem',
            color: '#0284c7',
            fontWeight: 600,
          }}
        >
          <UserIcon size={14} />
          <span>Aquisição / Propriedade Cliente</span>
        </span>
      );
    }
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
          fontSize: '0.77rem',
          color: '#475569',
          fontWeight: 600,
        }}
      >
        <BuildingIcon size={14} />
        <span>Locação Padrão (Propriedade Empresa)</span>
      </span>
    );
  };

  const pedidosFiltrados = pedidos.filter((p) => {
    const matchStatus = filtroStatus === 'TODOS' || p.status === filtroStatus;
    const termo = busca.toLowerCase();
    const matchBusca =
      p.codigoPedido?.toLowerCase().includes(termo) ||
      p.cliente?.nome?.toLowerCase().includes(termo) ||
      p.automovel?.modelo?.toLowerCase().includes(termo) ||
      p.automovel?.marca?.toLowerCase().includes(termo) ||
      p.automovel?.placa?.toLowerCase().includes(termo);
    return matchStatus && matchBusca;
  });

  const pendentesCount = pedidos.filter((p) => p.status === 'AGUARDANDO_ANALISE').length;
  const aprovadosCount = pedidos.filter(
    (p) => p.status === 'APROVADO_AGUARDANDO_CONTRATO' || p.status === 'CONTRATO_EXECUTADO'
  ).length;
  const volumeTotal = pedidos
    .filter((p) => p.status !== 'CANCELADO')
    .reduce((acc, p) => acc + Number(p.valorTotal || 0), 0);

  return (
    <div>
      {/* KPI Bento Grid */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div>
            <div className="kpi-label">Total de Pedidos</div>
            <div className="kpi-value">{pedidos.length}</div>
            <div className="kpi-sub">Solicitações registradas</div>
          </div>
          <div className="kpi-icon blue">
            <FileTextIcon size={22} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-label">Em Análise Financeira</div>
            <div className="kpi-value">{pendentesCount}</div>
            <div className="kpi-sub">Aguardando parecer do agente</div>
          </div>
          <div className="kpi-icon amber">
            <ClockIcon size={22} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-label">Parecer Positivo / Ativos</div>
            <div className="kpi-value">{aprovadosCount}</div>
            <div className="kpi-sub">Aprovados ou contratos executados</div>
          </div>
          <div className="kpi-icon green">
            <ShieldCheckIcon size={22} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-label">Volume Contratado</div>
            <div className="kpi-value">
              R$ {volumeTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="kpi-sub">Soma de pedidos ativos</div>
          </div>
          <div className="kpi-icon purple">
            <DollarSignIcon size={22} />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title-group">
            <div className="kpi-icon blue">
              <FileTextIcon size={20} />
            </div>
            <div>
              <h2 className="card-title">Gestão de Pedidos de Aluguel e Contratos</h2>
              <p className="card-subtitle">
                {isCliente
                  ? 'Introduza, consulte o status, modifique ou cancele seus pedidos e execute contratos após parecer positivo.'
                  : 'Painel do Agente: Analise pedidos financeiramente, associe contratos de crédito e gerencie modificações.'}
              </p>
            </div>
          </div>
          <button type="button" className="btn btn-primary" onClick={abrirNovoPedido}>
            <PlusIcon size={17} />
            <span>Introduzir Pedido</span>
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
              placeholder="Buscar por código (PED-...), cliente, veículo ou placa..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <select
              className="form-control"
              style={{ padding: '0.48rem 0.75rem', fontSize: '0.84rem' }}
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              aria-label="Filtrar por status"
            >
              <option value="TODOS">Todos os Status</option>
              <option value="AGUARDANDO_ANALISE">Aguardando Análise</option>
              <option value="APROVADO_AGUARDANDO_CONTRATO">Parecer Positivo (Pronto p/ Contrato)</option>
              <option value="CONTRATO_EXECUTADO">Contrato Executado</option>
              <option value="REJEITADO">Parecer Negativo</option>
              <option value="CANCELADO">Cancelados</option>
            </select>
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Código / Período</th>
                <th>Contratante &amp; Renda</th>
                <th>Automóvel &amp; Modalidade</th>
                <th>Valor Total</th>
                <th>Status &amp; Parecer Financeiro</th>
                <th>Contrato de Crédito</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pedidosFiltrados.map((p) => {
                const rendaCliente = (p.cliente?.rendimentos || []).reduce(
                  (acc, r) => acc + Number(r.valorRendimento || 0),
                  0
                );
                return (
                  <tr key={p.id}>
                    <td>
                      <strong className="mono" style={{ color: '#0f172a', fontSize: '0.86rem' }}>
                        {p.codigoPedido}
                      </strong>
                      <div
                        className="tabular"
                        style={{
                          fontSize: '0.76rem',
                          color: '#475569',
                          marginTop: '0.25rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                        }}
                      >
                        <CalendarIcon size={13} />
                        <span>
                          {p.dataInicio} até {p.dataFim}
                        </span>
                      </div>
                    </td>
                    <td>
                      <strong style={{ color: '#0f172a', fontWeight: 600 }}>
                        {p.cliente?.nome}
                      </strong>
                      <div className="mono" style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {p.cliente?.cpf} • {p.cliente?.profissao}
                      </div>
                      <div
                        className="tabular"
                        style={{
                          fontSize: '0.77rem',
                          color: '#059669',
                          fontWeight: 600,
                          marginTop: '0.2rem',
                        }}
                      >
                        Renda ({p.cliente?.rendimentos?.length || 0}/3): R${' '}
                        {rendaCliente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <strong style={{ color: '#0f172a' }}>
                          {p.automovel?.marca} {p.automovel?.modelo}
                        </strong>
                        <span className="plate-badge">{p.automovel?.placa}</span>
                      </div>
                      <div style={{ marginTop: '0.3rem' }}>
                        {renderModalidade(p.tipoContrato)}
                      </div>
                      {p.observacoesCliente && (
                        <div
                          style={{
                            fontSize: '0.75rem',
                            color: '#64748b',
                            fontStyle: 'italic',
                            marginTop: '0.25rem',
                          }}
                        >
                          &ldquo;{p.observacoesCliente}&rdquo;
                        </div>
                      )}
                    </td>
                    <td className="tabular">
                      <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>
                        R$ {Number(p.valorTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </strong>
                    </td>
                    <td style={{ maxWidth: '270px' }}>
                      {renderBadgeStatus(p.status)}
                      {p.parecerFinanceiro && (
                        <div
                          style={{
                            fontSize: '0.76rem',
                            background: '#f8fafc',
                            padding: '0.45rem 0.6rem',
                            borderRadius: '6px',
                            marginTop: '0.4rem',
                            border: '1px solid #e2e8f0',
                            color: '#334155',
                          }}
                        >
                          <strong>{p.agenteAvaliador?.nome || 'Agente'}:</strong>{' '}
                          {p.parecerFinanceiro}
                        </div>
                      )}
                    </td>
                    <td>
                      {p.contratoCredito ? (
                        <div style={{ fontSize: '0.77rem' }}>
                          <span className="badge badge-purple mono">
                            <CreditCardIcon size={12} />
                            <span>{p.contratoCredito.numeroContrato}</span>
                          </span>
                          <div style={{ marginTop: '0.25rem', color: '#334155' }}>
                            <strong>{p.contratoCredito.bancoAgente?.nome}</strong>
                          </div>
                          <div className="tabular" style={{ color: '#64748b' }}>
                            {p.contratoCredito.quantidadeParcelas}x • Juros:{' '}
                            {p.contratoCredito.taxaJurosMensal}% a.m.
                          </div>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
                          Não aplicável
                        </span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        {p.status !== 'CANCELADO' && p.status !== 'CONTRATO_EXECUTADO' && (
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            onClick={() => abrirModificarPedido(p)}
                          >
                            <EditIcon size={13} />
                            <span>Modificar</span>
                          </button>
                        )}

                        {isAgente &&
                          p.status !== 'CANCELADO' &&
                          p.status !== 'CONTRATO_EXECUTADO' && (
                            <button
                              type="button"
                              className="btn btn-primary btn-sm"
                              onClick={() => abrirModalAvaliacao(p)}
                            >
                              <ShieldCheckIcon size={14} />
                              <span>Avaliar Finanças</span>
                            </button>
                          )}

                        {p.status === 'APROVADO_AGUARDANDO_CONTRATO' && (
                          <button
                            type="button"
                            className="btn btn-success btn-sm"
                            onClick={() => handleExecutarContrato(p.id)}
                          >
                            <CheckCircleIcon size={14} />
                            <span>Executar Contrato</span>
                          </button>
                        )}

                        {p.status !== 'CANCELADO' && (
                          <button
                            type="button"
                            className="btn btn-danger-ghost btn-sm"
                            onClick={() => handleCancelarPedido(p.id)}
                          >
                            <XCircleIcon size={14} />
                            <span>Cancelar</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {pedidosFiltrados.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                    Nenhum pedido de aluguel encontrado para os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Introduzir / Modificar Pedido */}
      {modalPedido && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="card-header">
              <h3 className="card-title">
                {editandoPedidoId
                  ? 'Modificar Pedido de Aluguel'
                  : 'Introduzir Novo Pedido de Aluguel'}
              </h3>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setModalPedido(false)}
              >
                <XCircleIcon size={15} />
                <span>Fechar</span>
              </button>
            </div>

            <form onSubmit={handleSalvarPedido}>
              {!isCliente && !editandoPedidoId && (
                <div className="form-group">
                  <label>Contratante (Cliente) *</label>
                  <select
                    className="form-control"
                    value={pedidoForm.clienteId}
                    onChange={(e) => setPedidoForm({ ...pedidoForm, clienteId: e.target.value })}
                    required
                  >
                    {clientes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nome} (CPF: {c.cpf})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label>Automóvel Desejado *</label>
                <select
                  className="form-control"
                  value={pedidoForm.automovelId}
                  onChange={(e) => setPedidoForm({ ...pedidoForm, automovelId: e.target.value })}
                  required
                >
                  {automoveis.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.marca} {a.modelo} ({a.ano}) - Placa {a.placa} — R$ {a.valorDiaria}/dia
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label>Data de Início *</label>
                  <input
                    type="date"
                    className="form-control tabular"
                    value={pedidoForm.dataInicio}
                    onChange={(e) => setPedidoForm({ ...pedidoForm, dataInicio: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Data de Término *</label>
                  <input
                    type="date"
                    className="form-control tabular"
                    value={pedidoForm.dataFim}
                    onChange={(e) => setPedidoForm({ ...pedidoForm, dataFim: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Modalidade de Contrato e Registro de Propriedade *</label>
                <select
                  className="form-control"
                  value={pedidoForm.tipoContrato}
                  onChange={(e) => setPedidoForm({ ...pedidoForm, tipoContrato: e.target.value })}
                >
                  <option value="PADRAO_EMPRESA">
                    Aluguel Padrão (Propriedade registrada para a Empresa)
                  </option>
                  <option value="CREDITO_BANCO">
                    Associado a Contrato de Crédito (Propriedade registrada para o Banco Agente)
                  </option>
                  <option value="PROPRIEDADE_CLIENTE">
                    Leasing com Registro de Propriedade para o Cliente
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>Observações do Pedido</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Informe detalhes adicionais da retirada ou solicitação de crédito..."
                  value={pedidoForm.observacoesCliente}
                  onChange={(e) =>
                    setPedidoForm({ ...pedidoForm, observacoesCliente: e.target.value })
                  }
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '0.5rem',
                  marginTop: '1rem',
                }}
              >
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setModalPedido(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircleIcon size={16} />
                  <span>
                    {editandoPedidoId ? 'Salvar Modificações' : 'Enviar Pedido para Análise'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Análise Financeira pelo Agente */}
      {modalAvaliacao && pedidoEmAvaliacao && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="card-header">
              <h3 className="card-title">
                Análise Financeira — {pedidoEmAvaliacao.codigoPedido}
              </h3>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setModalAvaliacao(false)}
              >
                <XCircleIcon size={15} />
                <span>Fechar</span>
              </button>
            </div>

            <div className="rendimento-box" style={{ marginBottom: '1.1rem' }}>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '0.35rem', color: '#0f172a' }}>
                Dossiê Financeiro do Contratante: {pedidoEmAvaliacao.cliente?.nome}
              </h4>
              <p className="mono" style={{ fontSize: '0.8rem', color: '#475569' }}>
                CPF: {pedidoEmAvaliacao.cliente?.cpf} | RG: {pedidoEmAvaliacao.cliente?.rg} |{' '}
                {pedidoEmAvaliacao.cliente?.profissao}
              </p>
              <div style={{ marginTop: '0.5rem', fontSize: '0.82rem' }}>
                <strong>Entidades Empregadoras e Rendimentos Auferidos:</strong>
                <ul style={{ marginLeft: '1.2rem', marginTop: '0.25rem' }}>
                  {(pedidoEmAvaliacao.cliente?.rendimentos || []).map((r, i) => (
                    <li key={i} className="tabular">
                      {r.entidadeEmpregadora}:{' '}
                      <strong>
                        R${' '}
                        {Number(r.valorRendimento).toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                        })}
                      </strong>
                    </li>
                  ))}
                </ul>
              </div>
              <p
                className="tabular"
                style={{ marginTop: '0.55rem', fontSize: '0.88rem', color: '#2563eb' }}
              >
                <strong>Valor Total do Contrato:</strong> R${' '}
                {Number(pedidoEmAvaliacao.valorTotal).toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>

            <form onSubmit={handleAvaliarPedido}>
              <div className="form-group">
                <label>Decisão da Análise Financeira *</label>
                <select
                  className="form-control"
                  value={avaliacaoForm.parecerPositivo ? 'true' : 'false'}
                  onChange={(e) =>
                    setAvaliacaoForm({
                      ...avaliacaoForm,
                      parecerPositivo: e.target.value === 'true',
                    })
                  }
                >
                  <option value="true">
                    Parecer Positivo (Aprovar e disponibilizar para execução do contrato)
                  </option>
                  <option value="false">
                    Parecer Negativo (Rejeitar pedido por incompatibilidade financeira)
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>Justificativa / Parecer Técnico *</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={avaliacaoForm.parecerFinanceiro}
                  onChange={(e) =>
                    setAvaliacaoForm({ ...avaliacaoForm, parecerFinanceiro: e.target.value })
                  }
                  required
                />
              </div>

              {avaliacaoForm.parecerPositivo && (
                <div className="rendimento-box">
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontWeight: 700,
                      fontSize: '0.86rem',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={avaliacaoForm.concederContratoCredito}
                      onChange={(e) =>
                        setAvaliacaoForm({
                          ...avaliacaoForm,
                          concederContratoCredito: e.target.checked,
                        })
                      }
                    />
                    <CreditCardIcon size={16} />
                    <span>Associar Contrato de Crédito concedido por Banco Agente</span>
                  </label>

                  {avaliacaoForm.concederContratoCredito && (
                    <div className="grid-3" style={{ marginTop: '0.85rem' }}>
                      <div className="form-group">
                        <label>Banco Agente Concessor</label>
                        <select
                          className="form-control"
                          value={avaliacaoForm.bancoAgenteId}
                          onChange={(e) =>
                            setAvaliacaoForm({
                              ...avaliacaoForm,
                              bancoAgenteId: e.target.value,
                            })
                          }
                        >
                          {bancos.map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.nome}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Taxa de Juros (% a.m.)</label>
                        <input
                          type="number"
                          step="0.01"
                          className="form-control tabular"
                          value={avaliacaoForm.taxaJurosMensal}
                          onChange={(e) =>
                            setAvaliacaoForm({
                              ...avaliacaoForm,
                              taxaJurosMensal: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label>Nº de Parcelas</label>
                        <input
                          type="number"
                          min="1"
                          max="60"
                          className="form-control tabular"
                          value={avaliacaoForm.quantidadeParcelas}
                          onChange={(e) =>
                            setAvaliacaoForm({
                              ...avaliacaoForm,
                              quantidadeParcelas: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

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
                  onClick={() => setModalAvaliacao(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  <ShieldCheckIcon size={16} />
                  <span>Registrar Parecer Financeiro</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
