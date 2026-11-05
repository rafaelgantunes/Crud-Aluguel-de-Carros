import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  CarIcon,
  FileTextIcon,
  UsersIcon,
  UserIcon,
  BuildingIcon,
  BankIcon,
  LogOutIcon,
  LayersIcon,
} from './Icons';

export default function Navbar({ abaAtiva, setAbaAtiva }) {
  const { usuario, logout } = useAuth();

  const renderRoleBadge = (role) => {
    if (role === 'CLIENTE') {
      return (
        <span className="role-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
          <UserIcon size={12} /> Cliente
        </span>
      );
    }
    if (role === 'AGENTE_EMPRESA') {
      return (
        <span className="role-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
          <BuildingIcon size={12} /> Agente Empresa
        </span>
      );
    }
    if (role === 'AGENTE_BANCO') {
      return (
        <span className="role-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
          <BankIcon size={12} /> Agente Banco
        </span>
      );
    }
    return <span className="role-tag">{role}</span>;
  };

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <div className="brand-icon-box">
          <img src="/logo.jpg" alt="Logo AutoRent PUC Minas" className="brand-logo-img" />
        </div>
        <div>
          <span className="brand-title">AutoRent PUC Minas</span>
          <span className="brand-subtitle">Gestão de Locação &amp; Crédito Automotivo • LAB02</span>
        </div>
      </div>

      <nav className="navbar-links" aria-label="Navegação Principal">
        <button
          type="button"
          className={`nav-tab ${abaAtiva === 'pedidos' ? 'active' : ''}`}
          onClick={() => setAbaAtiva('pedidos')}
        >
          <FileTextIcon size={17} />
          <span>Pedidos e Contratos</span>
        </button>
        <button
          type="button"
          className={`nav-tab ${abaAtiva === 'clientes' ? 'active' : ''}`}
          onClick={() => setAbaAtiva('clientes')}
        >
          <UsersIcon size={17} />
          <span>Contratantes (CRUD)</span>
        </button>
        <button
          type="button"
          className={`nav-tab ${abaAtiva === 'automoveis' ? 'active' : ''}`}
          onClick={() => setAbaAtiva('automoveis')}
        >
          <CarIcon size={17} />
          <span>Frota e Propriedade</span>
        </button>
        <button
          type="button"
          className={`nav-tab ${abaAtiva === 'design-system' ? 'active' : ''}`}
          onClick={() => setAbaAtiva('design-system')}
        >
          <LayersIcon size={17} />
          <span>Design System</span>
        </button>
      </nav>

      <div className="navbar-user">
        <div className="user-pill">
          {renderRoleBadge(usuario?.role)}
          <strong style={{ fontWeight: 600 }}>{usuario?.nome}</strong>
        </div>
        <button
          type="button"
          className="btn btn-danger btn-sm"
          onClick={logout}
          title="Encerrar sessão"
        >
          <LogOutIcon size={15} />
          <span>Sair</span>
        </button>
      </div>
    </header>
  );
}
