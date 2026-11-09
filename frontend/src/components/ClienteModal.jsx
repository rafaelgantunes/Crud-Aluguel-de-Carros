import React from 'react';
import {
  AlertCircleIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  PlusIcon,
  TrashIcon,
  XCircleIcon,
} from './Icons';

export default function ClienteModal({
  aberto,
  editandoId,
  erro,
  form,
  setForm,
  onFechar,
  onSubmit,
  adicionarRendimento,
  removerRendimento,
  atualizarRendimento,
}) {
  if (!aberto) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="card-header">
          <h3 className="card-title">
            {editandoId ? `Editar Contratante #${editandoId}` : 'Cadastrar Novo Contratante'}
          </h3>
          <button type="button" className="btn btn-outline btn-sm" onClick={onFechar}>
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

        <form onSubmit={onSubmit}>
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
            <button type="button" className="btn btn-outline" onClick={onFechar}>
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
  );
}
