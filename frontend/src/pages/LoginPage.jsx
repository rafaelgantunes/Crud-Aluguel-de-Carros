import React, { useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

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
      setSucesso('Cadastro de cliente realizado com sucesso! Faça login para acessar o sistema.');
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
      setSucesso('Cadastro de Agente realizado com sucesso! Faça login para acessar o sistema.');
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
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.6rem', color: '#0f172a', marginBottom: '0.25rem' }}>
            🚗 Sistema de Aluguel de Carros
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            PUC Minas • Engenharia de Software • DIAW (Laboratório 02)
          </p>
          <p style={{ color: '#475569', fontSize: '0.82rem', marginTop: '0.25rem' }}>
            🔒 <em>O sistema só pode ser utilizado após cadastro prévio e autenticação obrigatória.</em>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <button
            type="button"
            className={`btn ${modo === 'login' ? 'btn-primary' : 'btn-outline'}`}
            style={{ flex: 1 }}
            onClick={() => { setModo('login'); setErro(''); }}
          >
            🔑 Login
          </button>
          <button
            type="button"
            className={`btn ${modo === 'cadastroCliente' ? 'btn-primary' : 'btn-outline'}`}
            style={{ flex: 1 }}
            onClick={() => { setModo('cadastroCliente'); setErro(''); setSucesso(''); }}
          >
            👤 Cadastrar Cliente
          </button>
          <button
            type="button"
            className={`btn ${modo === 'cadastroAgente' ? 'btn-primary' : 'btn-outline'}`}
            style={{ flex: 1 }}
            onClick={() => { setModo('cadastroAgente'); setErro(''); setSucesso(''); }}
          >
            🏦 Cadastrar Agente
          </button>
        </div>

        {erro && <div className="alert alert-error">{erro}</div>}
        {sucesso && <div className="alert alert-success">{sucesso}</div>}

        {modo === 'login' && (
          <>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Usuário (Username)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Digite seu usuário..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Senha</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Digite sua senha..."
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}
                disabled={carregando}
              >
                {carregando ? 'Autenticando...' : 'Entrar no Sistema'}
              </button>
            </form>

            <div
              style={{
                marginTop: '1.5rem',
                paddingTop: '1.1rem',
                borderTop: '1px solid #e2e8f0',
              }}
            >
              <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '0.6rem', fontWeight: 600 }}>
                ⚡ Acesso Rápido de Demonstração (Contas Pré-Cadastradas):
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => loginRapido('cliente', '123456')}
                >
                  👤 Cliente (cliente / 123456)
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => loginRapido('empresa', '123456')}
                >
                  🏢 Agente Empresa (empresa / 123456)
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => loginRapido('banco', '123456')}
                >
                  🏦 Agente Banco (banco / 123456)
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
                <label>RG *</label>
                <input
                  className="form-control"
                  placeholder="Ex: MG-12.345.678"
                  value={clienteForm.rg}
                  onChange={(e) => setClienteForm({ ...clienteForm, rg: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>CPF *</label>
                <input
                  className="form-control"
                  placeholder="000.000.000-00"
                  value={clienteForm.cpf}
                  onChange={(e) => setClienteForm({ ...clienteForm, cpf: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Endereço Residencial *</label>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: 700 }}>
                  💼 Entidades Empregadoras e Rendimentos Auferidos (Máximo 3)
                </label>
                {clienteForm.rendimentos.length < 3 && (
                  <button type="button" className="btn btn-outline btn-sm" onClick={adicionarCampoRendimento}>
                    + Adicionar Empregador ({clienteForm.rendimentos.length}/3)
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
                    onChange={(e) => atualizarRendimento(idx, 'entidadeEmpregadora', e.target.value)}
                    required
                  />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="form-control"
                    style={{ flex: 1 }}
                    placeholder="Rendimento (R$)"
                    value={rend.valorRendimento}
                    onChange={(e) => atualizarRendimento(idx, 'valorRendimento', e.target.value)}
                    required
                  />
                  {clienteForm.rendimentos.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => removerCampoRendimento(idx)}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="btn btn-success"
              style={{ width: '100%', padding: '0.75rem', marginTop: '1rem' }}
              disabled={carregando}
            >
              {carregando ? 'Cadastrando...' : 'Concluir Cadastro Prévio de Cliente'}
            </button>
          </form>
        )}

        {modo === 'cadastroAgente' && (
          <form onSubmit={handleCadastroAgente}>
            <div className="grid-2">
              <div className="form-group">
                <label>Tipo de Agente *</label>
                <select
                  className="form-control"
                  value={agenteForm.tipoAgente}
                  onChange={(e) => setAgenteForm({ ...agenteForm, tipoAgente: e.target.value })}
                >
                  <option value="EMPRESA">🏢 Empresa Locadora</option>
                  <option value="BANCO">🏦 Banco Agente (Concessor de Crédito)</option>
                </select>
              </div>
              <div className="form-group">
                <label>CNPJ *</label>
                <input
                  className="form-control"
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
              className="btn btn-success"
              style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}
              disabled={carregando}
            >
              {carregando ? 'Cadastrando...' : 'Concluir Cadastro de Agente'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

