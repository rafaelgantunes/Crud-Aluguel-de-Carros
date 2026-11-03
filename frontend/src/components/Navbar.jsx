import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ abaAtiva, setAbaAtiva }) {
  const { usuario, logout } = useAuth();

  const formatRole = (role) => {
    if (role === 'CLIENTE') return '👤 Cliente';
    if (role === 'AGENTE_EMPRESA') return '🏢 Agente (Empresa)';
    if (role === 'AGENTE_BANCO') return '🏦 Agente (Banco)';
    return role;
  };

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <div>
          🚗 AutoRent PUC Minas
          <span className="subtitle">LAB02 • Sistema de Aluguel de Carros (Spring Boot 4 + React)</span>
        </div>
      </div>

      <nav className="navbar-links">
        <button
          className={`nav-tab ${abaAtiva === 'pedidos' ? 'active' : ''}`}
          onClick={() => setAbaAtiva('pedidos')}
        >
          📋 Pedidos e Contratos
        </button>
        <button
          className={`nav-tab ${abaAtiva === 'clientes' ? 'active' : ''}`}
          onClick={() => setAbaAtiva('clientes')}
        >
          👥 CRUD de Clientes
        </button>
        <button
          className={`nav-tab ${abaAtiva === 'automoveis' ? 'active' : ''}`}
          onClick={() => setAbaAtiva('automoveis')}
        >
          🚙 Automóveis e Propriedade
        </button>
      </nav>

      <div className="navbar-user">
        <div className="user-pill">
          <span>{formatRole(usuario?.role)}</span>
          <strong>{usuario?.nome}</strong>
        </div>
        <button className="btn btn-danger btn-sm" onClick={logout}>
          Sair
        </button>
      </div>
    </header>
  );
}

