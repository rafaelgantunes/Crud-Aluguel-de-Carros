import React from 'react';
import { CreditCardIcon, ShieldCheckIcon, XCircleIcon } from './Icons';

export default function AvaliacaoFinanceiraModal({
  aberto,
  pedidoEmAvaliacao,
  onFechar,
  avaliacaoForm,
  setAvaliacaoForm,
  bancos,
  onSubmit,
}) {
  if (!aberto || !pedidoEmAvaliacao) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="card-header">
          <h3 className="card-title">Análise Financeira — {pedidoEmAvaliacao.codigoPedido}</h3>
          <button type="button" className="btn btn-outline btn-sm" onClick={onFechar}>
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

        <form onSubmit={onSubmit}>
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
            <button type="button" className="btn btn-outline" onClick={onFechar}>
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
  );
}
