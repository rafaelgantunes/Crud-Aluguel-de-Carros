import React, { useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  CarIcon,
  LockIcon,
  UserIcon,
  BuildingIcon,
  BankIcon,
  BriefcaseIcon,
  PlusIcon,
  TrashIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  ShieldCheckIcon,
} from '../components/Icons';

export default function LoginPage() {
  const { salvarLogin } = useAuth();
  const [modo, setModo] = useState('login'); // 'login' | 'cadastroCliente' | 'cadastroAgente'
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [carregando, setCarregando] = useState(false);

  // Estado Login
  const [username, setUsername] = useState('');
  const [senha, setSenha] = useState('');

  // Estado Cadastro Prévio de Cliente
  const [clienteForm, setClienteForm] = useState({
    username: '',
    senha: '',
    nome: '',
    rg: '',
    cpf: '',
    endereco: '',
    profissao: '',
    rendimentos: [{ entidadeEmpregadora: '', valorRendimento: '' }],
  });

  // Estado Cadastro Prévio de Agente
  const [agenteForm, setAgenteForm] = useState({
    username: '',
    senha: '',
    nome: '',
    cnpj: '',
    razaoSocial: '',
    tipoAgente: 'EMPRESA',
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);
    try {
      const resp = await api.login({ username, senha });
      salvarLogin(resp);
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  };

  const loginRapido = async (userDemo, passDemo) => {
    setUsername(userDemo);
    setSenha(passDemo);
    setErro('');
    setCarregando(true);
    try {
      const resp = await api.login({ username: userDemo, senha: passDemo });
      salvarLogin(resp);
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  };

  const adicionarCampoRendimento = () => {
    if (clienteForm.rendimentos.length >= 3) return;
    setClienteForm({
      ...clienteForm,
      rendimentos: [...clienteForm.rendimentos, { entidadeEmpregadora: '', valorRendimento: '' }],
    });
  };

  const removerCampoRendimento = (idx) => {
    const novos = clienteForm.rendimentos.filter((_, i) => i !== idx);
    setClienteForm({ ...clienteForm, rendimentos: novos });
  };

  const atualizarRendimento = (idx, campo, valor) => {
    const novos = [...clienteForm.rendimentos];
    novos[idx][campo] = valor;
    setClienteForm({ ...clienteForm, rendimentos: novos });
  };

  const handleCadastroCliente = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');
    setCarregando(true);
    try {
      const payload = {
        ...clienteForm,
        rendimentos: clienteForm.rendimentos
          .filter((r) => r.entidadeEmpregadora.trim() !== '' && r.valorRendimento !== '')
          .map((r) => ({
            entidadeEmpregadora: r.entidadeEmpregadora,
            valorRendimento: Number(r.valorRendimento),
          })),
      };
      await api.criarCliente(payload);
      setSucesso('Cadastro de cliente realizado com sucesso. Autentique-se abaixo para acessar.');
      setUsername(clienteForm.username);
      setSenha(clienteForm.senha);
      setModo('login');
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  };

  const handleCadastroAgente = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');
    setCarregando(true);
    try {
      await api.registrarAgente(agenteForm);
      setSucesso('Cadastro de Agente realizado com sucesso. Autentique-se abaixo para acessar.');
      setUsername(agenteForm.username);
      setSenha(agenteForm.senha);
      setModo('login');
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: '1.6rem' }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.85rem',
              boxShadow: '0 8px 20px rgba(37, 99, 235, 0.3)',
            }}
          >
            <CarIcon size={26} />
          </div>
          <h1 style={{ fontSize: '1.55rem', color: '#0f172a', fontWeight: 800 }}>
            AutoRent PUC Minas
          </h1>
          <p style={{ color: '#475569', fontSize: '0.88rem', marginTop: '0.2rem' }}>
            Sistema de Gestão de Aluguéis e Contratos de Crédito Automotivo
          </p>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              marginTop: '0.6rem',
              padding: '0.28rem 0.75rem',
              background: '#f1f5f9',
              borderRadius: '999px',
              fontSize: '0.76rem',
              color: '#475569',
              fontWeight: 500,
            }}
          >
            <ShieldCheckIcon size={14} />
            <span>Acesso restrito a usuários previamente cadastrados e autenticados</span>
          </div>
        </div>

        <div className="segmented-control" role="tablist">
          <button
            type="button"
            className={`segmented-btn ${modo === 'login' ? 'active' : ''}`}
            onClick={() => {
              setModo('login');
              setErro('');
            }}
          >
            <LockIcon size={15} />
            <span>Autenticação</span>
          </button>
          <button
            type="button"
            className={`segmented-btn ${modo === 'cadastroCliente' ? 'active' : ''}`}
            onClick={() => {
              setModo('cadastroCliente');
              setErro('');
              setSucesso('');
            }}
          >
            <UserIcon size={15} />
            <span>Novo Cliente</span>
          </button>
          <button
            type="button"
            className={`segmented-btn ${modo === 'cadastroAgente' ? 'active' : ''}`}
            onClick={() => {
              setModo('cadastroAgente');
              setErro('');
              setSucesso('');
            }}
          >
            <BankIcon size={15} />
            <span>Novo Agente</span>
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

        {modo === 'login' && (
          <>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="login-username">Usuário (Username)</label>
                <input
                  id="login-username"
                  type="text"
                  className="form-control"
                  placeholder="Ex: cliente, empresa ou banco"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="login-password">Senha de Acesso</label>
                <input
                  id="login-password"
                  type="password"
                  className="form-control"
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.72rem', marginTop: '0.4rem' }}
                disabled={carregando}
              >
                <LockIcon size={16} />
                <span>{carregando ? 'Verificando credenciais...' : 'Entrar no Sistema'}</span>
              </button>
            </form>

            <div
              style={{
                marginTop: '1.5rem',
                paddingTop: '1.15rem',
                borderTop: '1px solid #e2e8f0',
              }}
            >
              <p
                style={{
                  fontSize: '0.78rem',
                  color: '#64748b',
                  marginBottom: '0.65rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                Perfis de Demonstração (Acesso em 1 Clique)
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))', gap: '0.5rem' }}>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => loginRapido('cliente', '123456')}
                >
                  <UserIcon size={15} />
                  <span>Cliente (cliente)</span>
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => loginRapido('empresa', '123456')}
                >
                  <BuildingIcon size={15} />
                  <span>Empresa (empresa)</span>
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => loginRapido('banco', '123456')}
                >
                  <BankIcon size={15} />
                  <span>Banco (banco)</span>
                </button>
              </div>
            </div>
          </>
        )}

        {modo === 'cadastroCliente' && (
          <form onSubmit={handleCadastroCliente}>
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
                <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    className="form-control"
                    style={{ flex: 2 }}
                    placeholder={`Entidade Empregadora #${idx + 1}`}
                    value={rend.entidadeEmpregadora}
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
              <span>{carregando ? 'Processando cadastro...' : 'Concluir Cadastro Prévio de Cliente'}</span>
            </button>
          </form>
        )}

        {modo === 'cadastroAgente' && (
          <form onSubmit={handleCadastroAgente}>
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
        )}
      </div>
    </div>
  );
}
