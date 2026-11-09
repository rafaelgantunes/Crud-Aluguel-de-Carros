import React from 'react';
import {
  BankIcon,
  BuildingIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  CreditCardIcon,
  EditIcon,
  ShieldCheckIcon,
  UserIcon,
  XCircleIcon,
} from './Icons';

const formatarDataBR = (isoDate) => {
  if (!isoDate) return '-';
  const partes = String(isoDate).split('-');
  if (partes.length !== 3) return isoDate;
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
};

const renderBadgeStatus = (status) => {
  switch (status) {
    case 'AGUARDANDO_ANALISE':
      return (
        <span className="badge badge-warning">
          <ClockIcon size={13} />
          <span>Aguardando Análise</span>
        </span>
      );
    case 'APROVADO_AGUARDANDO_CONTRATO':
      return (
        <span className="badge badge-info">
          <ShieldCheckIcon size={13} />
          <span>Parecer Positivo</span>
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

export default function PedidosTable({
  pedidosFiltrados,
  isAgente,
  abrirModificarPedido,
  abrirModalAvaliacao,
  handleExecutarContrato,
  handleCancelarPedido,
}) {
  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th style={{ width: '18%' }}>Pedido &amp; Período</th>
            <th style={{ width: '19%' }}>Contratante &amp; Renda</th>
            <th style={{ width: '22%' }}>Automóvel &amp; Modalidade</th>
            <th style={{ width: '11%' }}>Valor Total</th>
            <th style={{ width: '18%' }}>Status, Parecer &amp; Crédito</th>
            <th style={{ width: '12%' }}>Ações</th>
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
                <td data-label="Pedido & Período">
                  <div>
                    <strong className="mono" style={{ color: '#0f172a', fontSize: '0.86rem' }}>
                      {p.codigoPedido}
                    </strong>
                  </div>
                  <div className="date-range-pill">
                    <CalendarIcon size={13} />
                    <span>{formatarDataBR(p.dataInicio)}</span>
                    <span className="date-arrow">&rarr;</span>
                    <span>{formatarDataBR(p.dataFim)}</span>
                  </div>
                </td>
                <td data-label="Contratante & Renda">
                  <strong style={{ color: '#0f172a', fontWeight: 600 }}>{p.cliente?.nome}</strong>
                  <div className="mono" style={{ fontSize: '0.74rem', color: '#64748b' }}>
                    {p.cliente?.cpf} • {p.cliente?.profissao}
                  </div>
                  <div
                    className="tabular"
                    style={{
                      fontSize: '0.76rem',
                      color: '#059669',
                      fontWeight: 600,
                      marginTop: '0.2rem',
                    }}
                  >
                    Renda ({p.cliente?.rendimentos?.length || 0}/3): R${' '}
                    {rendaCliente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </td>
                <td data-label="Automóvel & Modalidade">
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    <strong style={{ color: '#0f172a' }}>
                      {p.automovel?.marca} {p.automovel?.modelo}
                    </strong>
                    <span className="plate-badge">{p.automovel?.placa}</span>
                  </div>
                  <div style={{ marginTop: '0.28rem' }}>{renderModalidade(p.tipoContrato)}</div>
                  {p.observacoesCliente && (
                    <div
                      style={{
                        fontSize: '0.74rem',
                        color: '#64748b',
                        fontStyle: 'italic',
                        marginTop: '0.22rem',
                      }}
                    >
                      &ldquo;{p.observacoesCliente}&rdquo;
                    </div>
                  )}
                </td>
                <td data-label="Valor Total" className="tabular" style={{ whiteSpace: 'nowrap' }}>
                  <strong style={{ fontSize: '0.94rem', color: '#0f172a' }}>
                    R$ {Number(p.valorTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </strong>
                </td>
                <td data-label="Status, Parecer & Crédito">
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {renderBadgeStatus(p.status)}
                    {p.contratoCredito && (
                      <span
                        className="badge badge-purple mono"
                        title={`Banco: ${p.contratoCredito.bancoAgente?.nome}`}
                      >
                        <CreditCardIcon size={12} />
                        <span>
                          {p.contratoCredito.numeroContrato} ({p.contratoCredito.quantidadeParcelas}
                          x)
                        </span>
                      </span>
                    )}
                  </div>
                  {p.parecerFinanceiro && (
                    <div
                      style={{
                        fontSize: '0.74rem',
                        background: '#f8fafc',
                        padding: '0.4rem 0.55rem',
                        borderRadius: '6px',
                        marginTop: '0.38rem',
                        border: '1px solid #e2e8f0',
                        color: '#334155',
                        lineHeight: 1.35,
                      }}
                    >
                      <strong>{p.agenteAvaliador?.nome || 'Agente'}:</strong> {p.parecerFinanceiro}
                    </div>
                  )}
                </td>
                <td data-label="Ações">
                  <div className="table-actions">
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
              <td colSpan="6" style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                Nenhum pedido de aluguel encontrado para os filtros selecionados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
