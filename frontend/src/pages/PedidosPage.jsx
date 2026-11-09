import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  FileTextIcon,
  PlusIcon,
  CheckCircleIcon,
  ClockIcon,
  ShieldCheckIcon,
  SearchIcon,
  DollarSignIcon,
  AlertCircleIcon,
} from '../components/Icons';
import PedidoModal from '../components/PedidoModal';
import AvaliacaoFinanceiraModal from '../components/AvaliacaoFinanceiraModal';
import PedidosTable from '../components/PedidosTable';

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
              <option value="APROVADO_AGUARDANDO_CONTRATO">
                Parecer Positivo (Pronto p/ Contrato)
              </option>
              <option value="CONTRATO_EXECUTADO">Contrato Executado</option>
              <option value="REJEITADO">Parecer Negativo</option>
              <option value="CANCELADO">Cancelados</option>
            </select>
          </div>
        </div>

        <PedidosTable
          pedidosFiltrados={pedidosFiltrados}
          isAgente={isAgente}
          abrirModificarPedido={abrirModificarPedido}
          abrirModalAvaliacao={abrirModalAvaliacao}
          handleExecutarContrato={handleExecutarContrato}
          handleCancelarPedido={handleCancelarPedido}
        />
      </div>

      <PedidoModal
        aberto={modalPedido}
        onFechar={() => setModalPedido(false)}
        editandoPedidoId={editandoPedidoId}
        isCliente={isCliente}
        clientes={clientes}
        automoveis={automoveis}
        pedidoForm={pedidoForm}
        setPedidoForm={setPedidoForm}
        onSubmit={handleSalvarPedido}
      />

      <AvaliacaoFinanceiraModal
        aberto={modalAvaliacao}
        pedidoEmAvaliacao={pedidoEmAvaliacao}
        onFechar={() => setModalAvaliacao(false)}
        avaliacaoForm={avaliacaoForm}
        setAvaliacaoForm={setAvaliacaoForm}
        bancos={bancos}
        onSubmit={handleAvaliarPedido}
      />
    </div>
  );
}
