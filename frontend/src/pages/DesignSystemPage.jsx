import React, { useState } from 'react';
import {
  CarIcon,
  FileTextIcon,
  UsersIcon,
  UserIcon,
  BuildingIcon,
  BankIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  LogOutIcon,
  LockIcon,
  BriefcaseIcon,
  MapPinIcon,
  CalendarIcon,
  SearchIcon,
  DollarSignIcon,
  AlertCircleIcon,
  LayersIcon,
  ArrowLeftIcon,
} from '../components/Icons';

const COLOR_TOKENS = [
  {
    name: 'Brand Primary',
    token: '--brand',
    hex: '#2563EB',
    usage: 'Ações primárias, abas ativas e anel de foco',
    contrast: '4.6:1 (AA)',
    darkText: false,
  },
  {
    name: 'Brand Hover',
    token: '--brand-hover',
    hex: '#1D4ED8',
    usage: 'Estado hover de controles principais',
    contrast: '6.1:1 (AA)',
    darkText: false,
  },
  {
    name: 'Deep Obsidian Slate',
    token: '--bg-elevated',
    hex: '#0B1120',
    usage: 'Navbar executiva e fundo de autenticação',
    contrast: '18.4:1 (AAA)',
    darkText: false,
  },
  {
    name: 'Canvas Background',
    token: '--bg-canvas',
    hex: '#F1F5F9',
    usage: 'Plano de fundo geral da aplicação',
    contrast: '14.2:1 (AAA)',
    darkText: true,
  },
  {
    name: 'Status Success',
    token: '--success',
    hex: '#059669',
    usage: 'Parecer positivo, contrato executado, veículo disponível',
    contrast: '4.5:1 (AA)',
    darkText: false,
  },
  {
    name: 'Status Warning',
    token: '--warning',
    hex: '#D97706',
    usage: 'Aguardando análise financeira, propriedade empresa',
    contrast: '4.5:1 (AA)',
    darkText: false,
  },
  {
    name: 'Status Danger',
    token: '--danger',
    hex: '#DC2626',
    usage: 'Parecer negativo, cancelamento e ações destrutivas',
    contrast: '5.2:1 (AA)',
    darkText: false,
  },
  {
    name: 'Status Info',
    token: '--info',
    hex: '#0284C7',
    usage: 'Pronto para contrato, propriedade banco e metadados',
    contrast: '4.6:1 (AA)',
    darkText: false,
  },
  {
    name: 'Credit Purple',
    token: '--purple',
    hex: '#7C3AED',
    usage: 'Contratos de crédito bancário e propriedade cliente',
    contrast: '5.7:1 (AA)',
    darkText: false,
  },
];

const ICON_CATALOG = [
  { name: 'CarIcon', Comp: CarIcon },
  { name: 'FileTextIcon', Comp: FileTextIcon },
  { name: 'UsersIcon', Comp: UsersIcon },
  { name: 'UserIcon', Comp: UserIcon },
  { name: 'BuildingIcon', Comp: BuildingIcon },
  { name: 'BankIcon', Comp: BankIcon },
  { name: 'ShieldCheckIcon', Comp: ShieldCheckIcon },
  { name: 'CreditCardIcon', Comp: CreditCardIcon },
  { name: 'DollarSignIcon', Comp: DollarSignIcon },
  { name: 'BriefcaseIcon', Comp: BriefcaseIcon },
  { name: 'CalendarIcon', Comp: CalendarIcon },
  { name: 'ClockIcon', Comp: ClockIcon },
  { name: 'CheckCircleIcon', Comp: CheckCircleIcon },
  { name: 'XCircleIcon', Comp: XCircleIcon },
  { name: 'AlertCircleIcon', Comp: AlertCircleIcon },
  { name: 'SearchIcon', Comp: SearchIcon },
  { name: 'PlusIcon', Comp: PlusIcon },
  { name: 'EditIcon', Comp: EditIcon },
  { name: 'TrashIcon', Comp: TrashIcon },
  { name: 'LockIcon', Comp: LockIcon },
  { name: 'MapPinIcon', Comp: MapPinIcon },
  { name: 'LayersIcon', Comp: LayersIcon },
];

export default function DesignSystemPage({ onVoltar }) {
  const [copiado, setCopiado] = useState('');
  const [abaDemo, setAbaDemo] = useState('cliente');

  const copiarToken = (texto) => {
    navigator.clipboard?.writeText(texto);
    setCopiado(texto);
    setTimeout(() => setCopiado(''), 1800);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-canvas)' }}>
      {/* Top Bar Dedicada do Design System */}
      <header className="navbar">
        <div className="navbar-brand">
          <div className="brand-icon-box">
            <img src="/logo.jpg" alt="Logo AutoRent PUC Minas" className="brand-logo-img" />
          </div>
          <div>
            <span className="brand-title">Design System Master — AutoRent PUC Minas</span>
            <span className="brand-subtitle">
              Padrão UI/UX Pro Max • Automotive Mobility &amp; FinTech SaaS
            </span>
          </div>
        </div>

        <div className="navbar-user">
          <span className="role-tag">v1.0 • WCAG AA/AAA</span>
          {onVoltar && (
            <button type="button" className="btn btn-primary btn-sm" onClick={onVoltar}>
              <ArrowLeftIcon size={15} />
              <span>Voltar ao Sistema</span>
            </button>
          )}
        </div>
      </header>

      <main className="container">
        {/* Hero / Visão Geral */}
        <div className="card" style={{ background: 'linear-gradient(135deg, #0b1120 0%, #1e3a8a 100%)', color: '#ffffff', border: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div style={{ maxWidth: '720px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', background: 'rgba(255,255,255,0.12)', padding: '0.3rem 0.75rem', borderRadius: '999px', fontSize: '0.76rem', fontWeight: 600, marginBottom: '0.85rem' }}>
                <LayersIcon size={14} />
                <span>Documentação Viva de Arquitetura Visual (UI/UX Pro Max)</span>
              </div>
              <h1 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                Sistema de Design &amp; Guia de Componentes
              </h1>
              <p style={{ color: '#cbd5e1', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Especificação completa de cores, tipografia pareada, iconografia vetorial SVG sem emojis,
                indicadores executivos (KPIs) e componentes responsivos utilizados no Sistema de Aluguel de Carros da PUC Minas.
              </p>
            </div>
            <img
              src="/logo.jpg"
              alt="Logo Oficial AutoRent"
              style={{ width: 84, height: 84, borderRadius: 20, boxShadow: '0 12px 30px rgba(0,0,0,0.35)', border: '2px solid rgba(255,255,255,0.2)' }}
            />
          </div>
        </div>

        {/* 1. Paleta de Cores e Tokens */}
        <section className="card">
          <div className="card-header">
            <div className="card-title-group">
              <div className="kpi-icon blue">
                <LayersIcon size={20} />
              </div>
              <div>
                <h2 className="card-title">1. Paleta de Cores &amp; Design Tokens</h2>
                <p className="card-subtitle">
                  Clique em qualquer cartão de cor para copiar a variável CSS ou código HEX.
                </p>
              </div>
            </div>
            {copiado && (
              <span className="badge badge-success">
                <CheckCircleIcon size={13} />
                <span>Copiado: {copiado}</span>
              </span>
            )}
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '1rem',
            }}
          >
            {COLOR_TOKENS.map((c) => (
              <div
                key={c.token}
                onClick={() => copiarToken(`var(${c.token})`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && copiarToken(`var(${c.token})`)}
                style={{
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  background: '#ffffff',
                  transition: 'all 180ms ease',
                }}
              >
                <div
                  style={{
                    height: '78px',
                    background: c.hex,
                    color: c.darkText ? '#0f172a' : '#ffffff',
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid var(--border-subtle)',
                  }}
                >
                  <span className="mono" style={{ fontWeight: 700, fontSize: '0.84rem' }}>
                    {c.hex}
                  </span>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      padding: '0.15rem 0.45rem',
                      borderRadius: '999px',
                      background: c.darkText ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.2)',
                      fontWeight: 600,
                    }}
                  >
                    {c.contrast}
                  </span>
                </div>
                <div style={{ padding: '0.85rem 1rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>
                    {c.name}
                  </div>
                  <code
                    className="mono"
                    style={{
                      fontSize: '0.75rem',
                      color: '#2563eb',
                      display: 'block',
                      marginTop: '0.15rem',
                    }}
                  >
                    var({c.token})
                  </code>
                  <p style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '0.35rem' }}>
                    {c.usage}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Tipografia Pareada */}
        <section className="card">
          <div className="card-header">
            <div className="card-title-group">
              <div className="kpi-icon purple">
                <FileTextIcon size={20} />
              </div>
              <div>
                <h2 className="card-title">2. Sistema Tipográfico Pareado (Font Pairing)</h2>
                <p className="card-subtitle">
                  Combinação de fonte geométrica de destaque, fonte humanista de interface e monoespaçada tabular.
                </p>
              </div>
            </div>
          </div>

          <div className="grid-3">
            <div className="rendimento-box">
              <span className="badge badge-info">Display &amp; Títulos</span>
              <h3 style={{ fontSize: '1.35rem', marginTop: '0.6rem', fontWeight: 800 }}>
                Plus Jakarta Sans
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
                Pesos: 600, 700, 800 • Tracking: -0.02em
              </p>
              <div
                style={{
                  marginTop: '0.85rem',
                  paddingTop: '0.85rem',
                  borderTop: '1px solid var(--border-subtle)',
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.5rem',
                  fontWeight: 800,
                }}
              >
                R$ 10.300,00
              </div>
            </div>

            <div className="rendimento-box">
              <span className="badge badge-success">Interface &amp; Leitura</span>
              <h3 style={{ fontSize: '1.35rem', marginTop: '0.6rem', fontFamily: 'var(--font-sans)' }}>
                Inter UI Sans
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
                Pesos: 400, 500, 600 • Legibilidade em tabelas e formulários
              </p>
              <div
                style={{
                  marginTop: '0.85rem',
                  paddingTop: '0.85rem',
                  borderTop: '1px solid var(--border-subtle)',
                  fontSize: '0.88rem',
                  color: '#334155',
                }}
              >
                O aluguel de um automóvel pode estar associado a um contrato de crédito bancário.
              </div>
            </div>

            <div className="rendimento-box">
              <span className="badge badge-purple">Códigos &amp; Placas</span>
              <h3 className="mono" style={{ fontSize: '1.25rem', marginTop: '0.6rem' }}>
                JetBrains Mono
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
                Pesos: 500, 600 • <code>tabular-nums</code> para alinhamento vertical
              </p>
              <div
                className="mono"
                style={{
                  marginTop: '0.85rem',
                  paddingTop: '0.85rem',
                  borderTop: '1px solid var(--border-subtle)',
                  fontSize: '0.85rem',
                  display: 'flex',
                  gap: '0.5rem',
                  flexWrap: 'wrap',
                }}
              >
                <span className="plate-badge">RVA4B21</span>
                <span className="badge badge-purple">PED-DEMO001</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Biblioteca de Ícones Vetoriais SVG */}
        <section className="card">
          <div className="card-header">
            <div className="card-title-group">
              <div className="kpi-icon green">
                <ShieldCheckIcon size={20} />
              </div>
              <div>
                <h2 className="card-title">3. Iconografia Vetorial SVG (Zero Emojis)</h2>
                <p className="card-subtitle">
                  22 ícones vetoriais padronizados com <code>stroke-width: 1.85</code> e escala consistente.
                </p>
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(145px, 1fr))',
              gap: '0.75rem',
            }}
          >
            {ICON_CATALOG.map(({ name, Comp }) => (
              <div
                key={name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.7rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-subtle)',
                }}
              >
                <div style={{ color: 'var(--brand)', display: 'flex' }}>
                  <Comp size={18} />
                </div>
                <span className="mono" style={{ fontSize: '0.73rem', color: '#334155' }}>
                  {name}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Botões, Badges e Componentes Interativos */}
        <section className="card">
          <div className="card-header">
            <div className="card-title-group">
              <div className="kpi-icon amber">
                <CreditCardIcon size={20} />
              </div>
              <div>
                <h2 className="card-title">4. Catálogo de Componentes Interativos</h2>
                <p className="card-subtitle">
                  Botões, badges semânticas, indicadores de placa Mercosul, pills de período e controles segmentados.
                </p>
              </div>
            </div>
          </div>

          <div className="grid-2">
            {/* Botões */}
            <div className="rendimento-box">
              <h4 style={{ fontSize: '0.88rem', marginBottom: '0.75rem', color: '#0f172a' }}>
                Variantes de Botões (<code>.btn</code>)
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.55rem' }}>
                <button type="button" className="btn btn-primary">
                  <PlusIcon size={16} />
                  <span>Primário</span>
                </button>
                <button type="button" className="btn btn-success">
                  <CheckCircleIcon size={16} />
                  <span>Executar Contrato</span>
                </button>
                <button type="button" className="btn btn-outline">
                  <EditIcon size={15} />
                  <span>Secundário / Outline</span>
                </button>
                <button type="button" className="btn btn-danger-ghost">
                  <TrashIcon size={15} />
                  <span>Danger Ghost</span>
                </button>
                <button type="button" className="btn btn-danger">
                  <LogOutIcon size={15} />
                  <span>Destrutivo</span>
                </button>
              </div>
            </div>

            {/* Badges Semânticas e Automotivas */}
            <div className="rendimento-box">
              <h4 style={{ fontSize: '0.88rem', marginBottom: '0.75rem', color: '#0f172a' }}>
                Badges Semânticas, Placa Mercosul &amp; Datas
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
                <span className="badge badge-warning">
                  <ClockIcon size={13} />
                  <span>Aguardando Análise</span>
                </span>
                <span className="badge badge-info">
                  <ShieldCheckIcon size={13} />
                  <span>Parecer Positivo</span>
                </span>
                <span className="badge badge-success">
                  <CheckCircleIcon size={13} />
                  <span>Contrato Executado</span>
                </span>
                <span className="badge badge-danger">
                  <XCircleIcon size={13} />
                  <span>Cancelado</span>
                </span>
                <span className="badge badge-purple mono">
                  <CreditCardIcon size={12} />
                  <span>CRED-2026-8841 (12x)</span>
                </span>
                <span className="plate-badge">QXM9E84</span>
                <div className="date-range-pill" style={{ marginTop: 0 }}>
                  <CalendarIcon size={13} />
                  <span>05/11/2026</span>
                  <span className="date-arrow">&rarr;</span>
                  <span>12/11/2026</span>
                </div>
              </div>
            </div>
          </div>

          {/* Controle Segmentado e Busca */}
          <div className="grid-2" style={{ marginTop: '1rem' }}>
            <div className="rendimento-box">
              <h4 style={{ fontSize: '0.88rem', marginBottom: '0.75rem', color: '#0f172a' }}>
                Controle Segmentado (<code>.segmented-control</code>)
              </h4>
              <div className="segmented-control" style={{ marginBottom: 0 }}>
                <button
                  type="button"
                  className={`segmented-btn ${abaDemo === 'cliente' ? 'active' : ''}`}
                  onClick={() => setAbaDemo('cliente')}
                >
                  <UserIcon size={15} />
                  <span>Perfil Cliente</span>
                </button>
                <button
                  type="button"
                  className={`segmented-btn ${abaDemo === 'empresa' ? 'active' : ''}`}
                  onClick={() => setAbaDemo('empresa')}
                >
                  <BuildingIcon size={15} />
                  <span>Agente Empresa</span>
                </button>
                <button
                  type="button"
                  className={`segmented-btn ${abaDemo === 'banco' ? 'active' : ''}`}
                  onClick={() => setAbaDemo('banco')}
                >
                  <BankIcon size={15} />
                  <span>Agente Banco</span>
                </button>
              </div>
            </div>

            <div className="rendimento-box">
              <h4 style={{ fontSize: '0.88rem', marginBottom: '0.75rem', color: '#0f172a' }}>
                Campo de Busca Instantânea (<code>.search-box</code>)
              </h4>
              <div className="search-box" style={{ maxWidth: '100%' }}>
                <SearchIcon size={16} />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Exemplo de busca com foco acessível..."
                  readOnly
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
