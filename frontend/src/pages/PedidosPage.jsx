import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function PedidosPage() {
  const { usuario, isCliente, isAgente } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [automoveis, setAutomoveis] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [bancos, setBancos] = useState([]);
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
        setSucesso('Pedido de aluguel modificado com sucesso!');
      } else {
        await api.introduzirPedido(payload);
        setSucesso('Novo pedido de aluguel introduzido no sistema! Aguardando análise financeira.');
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
        'Parecer favorável: Renda mensal compatível com o valor do contrato.',
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
      setSucesso('Avaliação financeira registrada com sucesso!');
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
      setSucesso('Contrato executado com sucesso! O registro de propriedade do veículo foi atualizado.');
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
        return <span className="badge badge-warning">⏳ Aguardando Análise Financeira</span>;
      case 'APROVADO_AGUARDANDO_CONTRATO':
        return <span className="badge badge-info">✅ Parecer Positivo (Pronto p/ Contrato)</span>;
      case 'CONTRATO_EXECUTADO':
        return <span className="badge badge-success">📜 Contrato Executado</span>;
      case 'REJEITADO':
        return <span className="badge badge-danger">❌ Parecer Negativo</span>;
      case 'CANCELADO':
        return <span className="badge badge-danger">🚫 Cancelado</span>;
      default:
        return <span className="badge badge-info">{status}</span>;
    }
  };

  const formatTipoContrato = (tipo) => {
    if (tipo === 'CREDITO_BANCO') return '🏦 Associado a Contrato de Crédito (Propriedade Banco)';
    if (tipo === 'PROPRIEDADE_CLIENTE') return '👤 Leasing c/ Opção de Propriedade do Cliente';
    return '🏢 Locação Padrão (Propriedade Empresa)';
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">📋 Gestão de Pedidos de Aluguel e Execução de Contratos</h2>
            <p className="card-subtitle">
              {isCliente
                ? 'Introduza, consulte o status, modifique ou cancele seus pedidos e execute contratos após parecer financeiro positivo.'
                : 'Painel do Agente: Analise pedidos do ponto de vista financeiro, associe contratos de crédito e gerencie modificações.'}
            </p>
          </div>
          <button className="btn btn-primary" onClick={abrirNovoPedido}>
            + Introduzir Pedido de Aluguel
          </button>
        </div>

        {erro && <div className="alert alert-error">{erro}</div>}
        {sucesso && <div className="alert alert-success">{sucesso}</div>}

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Código / Período</th>
                <th>Contratante & Renda</th>
                <th>Automóvel & Modalidade</th>
                <th>Valor Total</th>
                <th>Status & Parecer Financeiro</th>
                <th>Contrato de Crédito</th>
                <th>Ações Disponíveis</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((p) => {
                const rendaCliente = (p.cliente?.rendimentos || []).reduce(
                  (acc, r) => acc + Number(r.valorRendimento || 0),
                  0
                );
                return (
                  <tr key={p.id}>
                    <td>
                      <strong>{p.codigoPedido}</strong>
                      <div style={{ fontSize: '0.8rem', color: '#475569' }}>
                        📅 {p.dataInicio} até {p.dataFim}
                      </div>
                    </td>
                    <td>
                      <strong>{p.cliente?.nome}</strong>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        CPF: {p.cliente?.cpf} • {p.cliente?.profissao}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#15803d', fontWeight: 600 }}>
                        💰 Renda ({p.cliente?.rendimentos?.length || 0}/3): R${' '}
                        {rendaCliente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                    </td>
                    <td>
                      <strong>
                        {p.automovel?.marca} {p.automovel?.modelo}
                      </strong>{' '}
                      <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        ({p.automovel?.placa})
                      </span>
                      <div style={{ fontSize: '0.78rem', color: '#334155', marginTop: '0.2rem' }}>
                        {formatTipoContrato(p.tipoContrato)}
                      </div>
                      {p.observacoesCliente && (
                        <div style={{ fontSize: '0.76rem', color: '#64748b', fontStyle: 'italic', marginTop: '0.2rem' }}>
                          "{p.observacoesCliente}"
                        </div>
                      )}
                    </td>
                    <td>
                      <strong style={{ fontSize: '0.98rem' }}>
                        R$ {Number(p.valorTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </strong>
                    </td>
                    <td style={{ maxWidth: '260px' }}>
                      {renderBadgeStatus(p.status)}
                      {p.parecerFinanceiro && (
                        <div
                          style={{
                            fontSize: '0.78rem',
                            background: '#f8fafc',
                            padding: '0.4rem 0.55rem',
                            borderRadius: '6px',
                            marginTop: '0.35rem',
                            border: '1px solid #e2e8f0',
                          }}
                        >
                          <strong>Parecer ({p.agenteAvaliador?.nome || 'Agente'}):</strong> {p.parecerFinanceiro}
                        </div>
                      )}
                    </td>
                    <td>
                      {p.contratoCredito ? (
                        <div style={{ fontSize: '0.78rem' }}>
                          <span className="badge badge-purple">{p.contratoCredito.numeroContrato}</span>
                          <div style={{ marginTop: '0.2rem' }}>
                            <strong>Banco:</strong> {p.contratoCredito.bancoAgente?.nome}
                          </div>
                          <div>
                            {p.contratoCredito.quantidadeParcelas}x • Juros: {p.contratoCredito.taxaJurosMensal}% a.m.
                          </div>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Sem financiamento</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        {p.status !== 'CANCELADO' && p.status !== 'CONTRATO_EXECUTADO' && (
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => abrirModificarPedido(p)}
                          >
                            ✏️ Modificar
                          </button>
                        )}

                        {isAgente && p.status !== 'CANCELADO' && p.status !== 'CONTRATO_EXECUTADO' && (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => abrirModalAvaliacao(p)}
                          >
                            🔍 Avaliar Finanças
                          </button>
                        )}

                        {p.status === 'APROVADO_AGUARDANDO_CONTRATO' && (
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleExecutarContrato(p.id)}
                          >
                            ✍️ Executar Contrato
                          </button>
                        )}

                        {p.status !== 'CANCELADO' && (
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleCancelarPedido(p.id)}
                          >
                            🚫 Cancelar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {pedidos.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                    Nenhum pedido de aluguel encontrado.
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
                {editandoPedidoId ? '✏️ Modificar Pedido de Aluguel' : '🚗 Introduzir Novo Pedido de Aluguel'}
              </h3>
              <button className="btn btn-outline btn-sm" onClick={() => setModalPedido(false)}>
                ✕ Fechar
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
                    className="form-control"
                    value={pedidoForm.dataInicio}
                    onChange={(e) => setPedidoForm({ ...pedidoForm, dataInicio: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Data de Término *</label>
                  <input
                    type="date"
                    className="form-control"
                    value={pedidoForm.dataFim}
                    onChange={(e) => setPedidoForm({ ...pedidoForm, dataFim: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Tipo de Contrato e Registro de Propriedade *</label>
                <select
                  className="form-control"
                  value={pedidoForm.tipoContrato}
                  onChange={(e) => setPedidoForm({ ...pedidoForm, tipoContrato: e.target.value })}
                >
                  <option value="PADRAO_EMPRESA">
                    🏢 Aluguel Padrão (Propriedade registrada para a Empresa)
                  </option>
                  <option value="CREDITO_BANCO">
                    🏦 Associado a Contrato de Crédito (Propriedade registrada para o Banco Agente)
                  </option>
                  <option value="PROPRIEDADE_CLIENTE">
                    👤 Aluguel / Leasing com Transferência de Propriedade ao Cliente
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
                  onChange={(e) => setPedidoForm({ ...pedidoForm, observacoesCliente: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setModalPedido(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  💾 {editandoPedidoId ? 'Salvar Modificações' : 'Enviar Pedido para Análise'}
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
                🔍 Análise Financeira do Pedido {pedidoEmAvaliacao.codigoPedido}
              </h3>
              <button className="btn btn-outline btn-sm" onClick={() => setModalAvaliacao(false)}>
                ✕ Fechar
              </button>
            </div>

            <div className="rendimento-box" style={{ marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '0.92rem', marginBottom: '0.4rem' }}>
                📊 Dossiê Financeiro do Contratante: {pedidoEmAvaliacao.cliente?.nome}
              </h4>
              <p style={{ fontSize: '0.84rem', color: '#475569' }}>
                <strong>CPF:</strong> {pedidoEmAvaliacao.cliente?.cpf} | <strong>RG:</strong> {pedidoEmAvaliacao.cliente?.rg} |{' '}
                <strong>Profissão:</strong> {pedidoEmAvaliacao.cliente?.profissao}
              </p>
              <div style={{ marginTop: '0.5rem', fontSize: '0.84rem' }}>
                <strong>Entidades Empregadoras e Rendimentos Auferidos:</strong>
                <ul style={{ marginLeft: '1.2rem', marginTop: '0.25rem' }}>
                  {(pedidoEmAvaliacao.cliente?.rendimentos || []).map((r, i) => (
                    <li key={i}>
                      {r.entidadeEmpregadora}:{' '}
                      <strong>
                        R$ {Number(r.valorRendimento).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </strong>
                    </li>
                  ))}
                </ul>
              </div>
              <p style={{ marginTop: '0.5rem', fontSize: '0.88rem', color: '#1d4ed8' }}>
                <strong>Valor Total do Pedido:</strong> R${' '}
                {Number(pedidoEmAvaliacao.valorTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>

            <form onSubmit={handleAvaliarPedido}>
              <div className="form-group">
                <label>Resultado da Análise Financeira *</label>
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
                  <option value="true">✅ Parecer Positivo (Aprovar e colocar à consideração para execução)</option>
                  <option value="false">❌ Parecer Negativo (Rejeitar pedido por incompatibilidade financeira)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Justificativa / Parecer Financeiro *</label>
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
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.88rem' }}>
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
                    🏦 Associar Contrato de Crédito concedido por Banco Agente
                  </label>

                  {avaliacaoForm.concederContratoCredito && (
                    <div className="grid-3" style={{ marginTop: '0.75rem' }}>
                      <div className="form-group">
                        <label>Banco Agente Concessor</label>
                        <select
                          className="form-control"
                          value={avaliacaoForm.bancoAgenteId}
                          onChange={(e) =>
                            setAvaliacaoForm({ ...avaliacaoForm, bancoAgenteId: e.target.value })
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
                          className="form-control"
                          value={avaliacaoForm.taxaJurosMensal}
                          onChange={(e) =>
                            setAvaliacaoForm({ ...avaliacaoForm, taxaJurosMensal: e.target.value })
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label>Nº de Parcelas</label>
                        <input
                          type="number"
                          min="1"
                          max="60"
                          className="form-control"
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

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setModalAvaliacao(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  💾 Registrar Parecer Financeiro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

