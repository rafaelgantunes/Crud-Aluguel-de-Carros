import React from 'react';
import { CheckCircleIcon, XCircleIcon } from './Icons';

export default function PedidoModal({
  aberto,
  onFechar,
  editandoPedidoId,
  isCliente,
  clientes,
  automoveis,
  pedidoForm,
  setPedidoForm,
  onSubmit,
}) {
  if (!aberto) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="card-header">
          <h3 className="card-title">
            {editandoPedidoId ? 'Modificar Pedido de Aluguel' : 'Introduzir Novo Pedido de Aluguel'}
          </h3>
          <button type="button" className="btn btn-outline btn-sm" onClick={onFechar}>
            <XCircleIcon size={15} />
            <span>Fechar</span>
          </button>
        </div>

        <form onSubmit={onSubmit}>
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
            <button type="button" className="btn btn-outline" onClick={onFechar}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              <CheckCircleIcon size={16} />
              <span>{editandoPedidoId ? 'Salvar Modificações' : 'Enviar Pedido para Análise'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
