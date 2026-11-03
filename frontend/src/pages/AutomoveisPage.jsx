import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  CarIcon,
  PlusIcon,
  BuildingIcon,
  BankIcon,
  UserIcon,
  SearchIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  XCircleIcon,
} from '../components/Icons';

export default function AutomoveisPage() {
  const { isAgente } = useAuth();
  const [automoveis, setAutomoveis] = useState([]);
  const [busca, setBusca] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [modalAberto, setModalAberto] = useState(false);

  const formInicial = {
    matricula: '',
    ano: 2025,
    marca: '',
    modelo: '',
    placa: '',
    valorDiaria: 220,
    disponivel: true,
    tipoProprietario: 'EMPRESA',
    nomeProprietario: 'AutoRent Minas Locadora',
  };
  const [form, setForm] = useState(formInicial);

  const carregarAutomoveis = async () => {
    try {
      const lista = await api.listarAutomoveis();
      setAutomoveis(lista);
    } catch (err) {
      setErro(err.message);
    }
  };

  useEffect(() => {
    carregarAutomoveis();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');
    try {
      await api.cadastrarAutomovel({
        ...form,
        ano: Number(form.ano),
        valorDiaria: Number(form.valorDiaria),
      });
      setSucesso('Automóvel registrado com sucesso na frota.');
      setModalAberto(false);
      setForm(formInicial);
      carregarAutomoveis();
    } catch (err) {
      setErro(err.message);
    }
  };

  const renderBadgeProprietario = (tipo) => {
    if (tipo === 'CLIENTE') {
      return (
        <span className="badge badge-purple">
          <UserIcon size={13} />
          <span>Propriedade: CLIENTE</span>
        </span>
      );
    }
    if (tipo === 'BANCO') {
      return (
        <span className="badge badge-info">
          <BankIcon size={13} />
          <span>Propriedade: BANCO</span>
        </span>
      );
    }
    return (
      <span className="badge badge-warning">
        <BuildingIcon size={13} />
        <span>Propriedade: EMPRESA</span>
      </span>
    );
  };

  const autosFiltrados = automoveis.filter((a) => {
    const termo = busca.toLowerCase();
    return (
      a.marca?.toLowerCase().includes(termo) ||
      a.modelo?.toLowerCase().includes(termo) ||
      a.placa?.toLowerCase().includes(termo) ||
      a.matricula?.toLowerCase().includes(termo)
    );
  });

  const totalDisponiveis = automoveis.filter((a) => a.disponivel).length;
  const totalBancos = automoveis.filter((a) => a.tipoProprietario === 'BANCO').length;

  return (
    <div>
      {/* KPI Bento Grid */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div>
            <div className="kpi-label">Frota Total Registrada</div>
            <div className="kpi-value">{automoveis.length}</div>
            <div className="kpi-sub">Veículos cadastrados no sistema</div>
          </div>
          <div className="kpi-icon blue">
            <CarIcon size={22} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-label">Prontos para Locação</div>
            <div className="kpi-value">{totalDisponiveis}</div>
            <div className="kpi-sub">Disponibilidade imediata</div>
          </div>
          <div className="kpi-icon green">
            <CheckCircleIcon size={22} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-label">Vinculados a Bancos</div>
            <div className="kpi-value">{totalBancos}</div>
            <div className="kpi-sub">Sob titularidade de Bancos Agentes</div>
          </div>
          <div className="kpi-icon purple">
            <BankIcon size={22} />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title-group">
            <div className="kpi-icon blue">
              <CarIcon size={20} />
            </div>
            <div>
              <h2 className="card-title">Frota de Automóveis e Registro de Propriedade</h2>
              <p className="card-subtitle">
                Controle de matrícula, ano, marca, modelo, placa e titularidade jurídica (Cliente, Empresa ou Banco).
              </p>
            </div>
          </div>
          {isAgente && (
            <button type="button" className="btn btn-primary" onClick={() => setModalAberto(true)}>
              <PlusIcon size={17} />
              <span>Cadastrar Automóvel</span>
            </button>
          )}
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

        <div className="toolbar">
          <div className="search-box">
            <SearchIcon size={16} />
            <input
              type="text"
              className="search-input"
              placeholder="Filtrar por marca, modelo, placa ou matrícula..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Exibindo <strong>{autosFiltrados.length}</strong> veículos
          </span>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Matrícula</th>
                <th>Veículo (Marca / Modelo)</th>
                <th>Ano</th>
                <th>Placa</th>
                <th>Diária</th>
                <th>Titularidade / Propriedade</th>
                <th>Status da Frota</th>
              </tr>
            </thead>
            <tbody>
              {autosFiltrados.map((auto) => (
                <tr key={auto.id}>
                  <td data-label="Matrícula" className="mono" style={{ fontWeight: 600, color: '#334155' }}>
                    {auto.matricula}
                  </td>
                  <td data-label="Veículo (Marca / Modelo)">
                    <strong style={{ color: '#0f172a', fontSize: '0.92rem' }}>
                      {auto.marca} {auto.modelo}
                    </strong>
                  </td>
                  <td data-label="Ano" className="tabular">{auto.ano}</td>
                  <td data-label="Placa">
                    <span className="plate-badge">{auto.placa}</span>
                  </td>
                  <td data-label="Diária" className="tabular">
                    <strong>
                      R${' '}
                      {Number(auto.valorDiaria).toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                      })}
                    </strong>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>/dia</span>
                  </td>
                  <td data-label="Titularidade / Propriedade">
                    {renderBadgeProprietario(auto.tipoProprietario)}
                    <div style={{ fontSize: '0.76rem', color: '#475569', marginTop: '0.25rem' }}>
                      Titular: <strong>{auto.nomeProprietario || 'Não informado'}</strong>
                    </div>
                  </td>
                  <td data-label="Status da Frota">
                    {auto.disponivel ? (
                      <span className="badge badge-success">
                        <span className="badge-dot" />
                        Disponível
                      </span>
                    ) : (
                      <span className="badge badge-danger">
                        <span className="badge-dot" />
                        Em Contrato Ativo
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {autosFiltrados.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                    Nenhum automóvel encontrado para a busca.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalAberto && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="card-header">
              <h3 className="card-title">Cadastrar Novo Automóvel</h3>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setModalAberto(false)}
              >
                <XCircleIcon size={15} />
                <span>Fechar</span>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid-2">
                <div className="form-group">
                  <label>Matrícula *</label>
                  <input
                    className="form-control mono"
                    placeholder="Ex: MAT-2026-005"
                    value={form.matricula}
                    onChange={(e) => setForm({ ...form, matricula: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Placa Mercosul *</label>
                  <input
                    className="form-control mono"
                    placeholder="Ex: ABC1D23"
                    value={form.placa}
                    onChange={(e) => setForm({ ...form, placa: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Marca *</label>
                  <input
                    className="form-control"
                    placeholder="Ex: Honda"
                    value={form.marca}
                    onChange={(e) => setForm({ ...form, marca: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Modelo *</label>
                  <input
                    className="form-control"
                    placeholder="Ex: Civic Hybrid"
                    value={form.modelo}
                    onChange={(e) => setForm({ ...form, modelo: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Ano de Fabricação *</label>
                  <input
                    type="number"
                    className="form-control tabular"
                    value={form.ano}
                    onChange={(e) => setForm({ ...form, ano: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Valor da Diária (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control tabular"
                    value={form.valorDiaria}
                    onChange={(e) => setForm({ ...form, valorDiaria: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Propriedade Inicial *</label>
                  <select
                    className="form-control"
                    value={form.tipoProprietario}
                    onChange={(e) => setForm({ ...form, tipoProprietario: e.target.value })}
                  >
                    <option value="EMPRESA">Empresa Locadora</option>
                    <option value="BANCO">Banco Agente</option>
                    <option value="CLIENTE">Cliente Individual</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Nome do Proprietário *</label>
                  <input
                    className="form-control"
                    value={form.nomeProprietario}
                    onChange={(e) => setForm({ ...form, nomeProprietario: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '0.5rem',
                  marginTop: '1rem',
                }}
              >
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setModalAberto(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircleIcon size={16} />
                  <span>Salvar Automóvel</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
