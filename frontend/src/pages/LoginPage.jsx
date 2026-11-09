import React, { useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  LockIcon,
  UserIcon,
  BuildingIcon,
  BankIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  ShieldCheckIcon,
  LayersIcon,
} from '../components/Icons';
import { CadastroAgenteForm, CadastroClienteForm } from '../components/CadastroPrevioForms';

export default function LoginPage({ onAbrirDesignSystem }) {
  const { salvarLogin } = useAuth();
  const [modo, setModo] = useState('login');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [carregando, setCarregando] = useState(false);

  const [username, setUsername] = useState('');
  const [senha, setSenha] = useState('');

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
          <img src="/logo.jpg" alt="Logo AutoRent PUC Minas" className="auth-logo-img" />
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
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))',
                  gap: '0.5rem',
                }}
              >
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
          <CadastroClienteForm
            clienteForm={clienteForm}
            setClienteForm={setClienteForm}
            carregando={carregando}
            onSubmit={handleCadastroCliente}
            adicionarCampoRendimento={adicionarCampoRendimento}
            removerCampoRendimento={removerCampoRendimento}
            atualizarRendimento={atualizarRendimento}
          />
        )}

        {modo === 'cadastroAgente' && (
          <CadastroAgenteForm
            agenteForm={agenteForm}
            setAgenteForm={setAgenteForm}
            carregando={carregando}
            onSubmit={handleCadastroAgente}
          />
        )}

        {onAbrirDesignSystem && (
          <div
            style={{
              marginTop: '1.25rem',
              paddingTop: '1rem',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <button
              type="button"
              className="btn btn-outline btn-sm"
              style={{ width: '100%' }}
              onClick={onAbrirDesignSystem}
            >
              <LayersIcon size={15} />
              <span>Explorar Página de Design System (UI/UX Pro Max)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
