import React from 'react';
import { BriefcaseIcon, CheckCircleIcon, PlusIcon, TrashIcon } from './Icons';

export function CadastroClienteForm({
  clienteForm,
  setClienteForm,
  carregando,
  onSubmit,
  adicionarCampoRendimento,
  removerCampoRendimento,
  atualizarRendimento,
}) {
  return (
    <form onSubmit={onSubmit}>
      <div className="grid-2">
        <div className="form-group">
          <label>Nome Completo *</label>
          <input
            className="form-control"
            value={clienteForm.nome}
            onChange={(e) => setClienteForm({ ...clienteForm, nome: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Profissão *</label>
          <input
            className="form-control"
            value={clienteForm.profissao}
            onChange={(e) => setClienteForm({ ...clienteForm, profissao: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Documento RG *</label>
          <input
            className="form-control mono"
            placeholder="MG-12.345.678"
            value={clienteForm.rg}
            onChange={(e) => setClienteForm({ ...clienteForm, rg: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>CPF *</label>
          <input
            className="form-control mono"
            placeholder="000.000.000-00"
            value={clienteForm.cpf}
            onChange={(e) => setClienteForm({ ...clienteForm, cpf: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label>Endereço Residencial Completo *</label>
        <input
          className="form-control"
          value={clienteForm.endereco}
          onChange={(e) => setClienteForm({ ...clienteForm, endereco: e.target.value })}
          required
        />
      </div>

      <div className="grid-2">
        <div className="form-group">
          <label>Usuário para Login *</label>
          <input
            className="form-control"
            value={clienteForm.username}
            onChange={(e) => setClienteForm({ ...clienteForm, username: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Senha *</label>
          <input
            type="password"
            className="form-control"
            value={clienteForm.senha}
            onChange={(e) => setClienteForm({ ...clienteForm, senha: e.target.value })}
            required
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
            <span>Entidades Empregadoras e Rendimentos Auferidos (Máx. 3)</span>
          </label>
          {clienteForm.rendimentos.length < 3 && (
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={adicionarCampoRendimento}
            >
              <PlusIcon size={14} />
              <span>Adicionar ({clienteForm.rendimentos.length}/3)</span>
            </button>
          )}
        </div>

        {clienteForm.rendimentos.map((rend, idx) => (
          <div key={idx} className="rendimento-row">
            <input
              className="form-control"
              style={{ flex: 2 }}
              placeholder={`Entidade Empregadora #${idx + 1}`}
              value={rend.entidadeEmpregadora}
              onChange={(e) => atualizarRendimento(idx, 'entidadeEmpregadora', e.target.value)}
              required
            />
            <input
              type="number"
              step="0.01"
              min="0"
              className="form-control tabular"
              style={{ flex: 1 }}
              placeholder="Rendimento (R$)"
              value={rend.valorRendimento}
              onChange={(e) => atualizarRendimento(idx, 'valorRendimento', e.target.value)}
              required
            />
            {clienteForm.rendimentos.length > 1 && (
              <button
                type="button"
                className="btn btn-danger-ghost btn-sm"
                onClick={() => removerCampoRendimento(idx)}
                aria-label="Remover rendimento"
              >
                <TrashIcon size={14} />
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        style={{ width: '100%', padding: '0.72rem', marginTop: '1rem' }}
        disabled={carregando}
      >
        <CheckCircleIcon size={16} />
        <span>
          {carregando ? 'Processando cadastro...' : 'Concluir Cadastro Prévio de Cliente'}
        </span>
      </button>
    </form>
  );
}

export function CadastroAgenteForm({ agenteForm, setAgenteForm, carregando, onSubmit }) {
  return (
    <form onSubmit={onSubmit}>
      <div className="grid-2">
        <div className="form-group">
          <label>Categoria de Agente *</label>
          <select
            className="form-control"
            value={agenteForm.tipoAgente}
            onChange={(e) => setAgenteForm({ ...agenteForm, tipoAgente: e.target.value })}
          >
            <option value="EMPRESA">Empresa Locadora</option>
            <option value="BANCO">Banco Agente (Concessor de Crédito)</option>
          </select>
        </div>
        <div className="form-group">
          <label>CNPJ *</label>
          <input
            className="form-control mono"
            placeholder="00.000.000/0001-00"
            value={agenteForm.cnpj}
            onChange={(e) => setAgenteForm({ ...agenteForm, cnpj: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Nome Fantasia *</label>
          <input
            className="form-control"
            value={agenteForm.nome}
            onChange={(e) => setAgenteForm({ ...agenteForm, nome: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Razão Social *</label>
          <input
            className="form-control"
            value={agenteForm.razaoSocial}
            onChange={(e) => setAgenteForm({ ...agenteForm, razaoSocial: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Usuário (Username) *</label>
          <input
            className="form-control"
            value={agenteForm.username}
            onChange={(e) => setAgenteForm({ ...agenteForm, username: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Senha *</label>
          <input
            type="password"
            className="form-control"
            value={agenteForm.senha}
            onChange={(e) => setAgenteForm({ ...agenteForm, senha: e.target.value })}
            required
          />
        </div>
      </div>
      <button
        type="submit"
        className="btn btn-primary"
        style={{ width: '100%', padding: '0.72rem', marginTop: '0.5rem' }}
        disabled={carregando}
      >
        <CheckCircleIcon size={16} />
        <span>{carregando ? 'Processando cadastro...' : 'Concluir Cadastro de Agente'}</span>
      </button>
    </form>
  );
}
