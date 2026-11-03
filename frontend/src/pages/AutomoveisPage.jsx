import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AutomoveisPage() {
  const { isAgente } = useAuth();
  const [automoveis, setAutomoveis] = useState([]);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [modalAberto, setModalAberto] = useState(false);

  const formInicial = {
    matricula: '',
    ano: 2025,
    marca: '',
    modelo: '',
    placa: '',
    valorDiaria: 200,
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
      setSucesso('Automóvel registrado com sucesso na frota!');
      setModalAberto(false);
      setForm(formInicial);
      carregarAutomoveis();
    } catch (err) {
      setErro(err.message);
    }
  };

  const renderBadgeProprietario = (tipo) => {
    if (tipo === 'CLIENTE') return <span className="badge badge-purple">👤 Propriedade: CLIENTE</span>;
    if (tipo === 'BANCO') return <span className="badge badge-info">🏦 Propriedade: BANCO</span>;
    return <span className="badge badge-warning">🏢 Propriedade: EMPRESA</span>;
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">🚙 Frota de Automóveis e Registro de Propriedade</h2>
            <p className="card-subtitle">
              Registra matrícula, ano, marca, modelo e placa. Dependendo do contrato, os automóveis podem ser registrados como propriedade de clientes, empresas ou bancos.
            </p>
          </div>
          {isAgente && (
            <button className="btn btn-primary" onClick={() => setModalAberto(true)}>
              + Cadastrar Automóvel
            </button>
          )}
        </div>

        {erro && <div className="alert alert-error">{erro}</div>}
        {sucesso && <div className="alert alert-success">{sucesso}</div>}

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Matrícula</th>
                <th>Veículo (Marca / Modelo / Ano)</th>
                <th>Placa</th>
                <th>Valor Diária</th>
                <th>Titularidade / Propriedade</th>
                <th>Disponibilidade</th>
              </tr>
            </thead>
            <tbody>
              {automoveis.map((auto) => (
                <tr key={auto.id}>
                  <td>
                    <code>{auto.matricula}</code>
                  </td>
                  <td>
                    <strong>{auto.marca} {auto.modelo}</strong> ({auto.ano})
                  </td>
                  <td>
                    <span className="badge badge-outline" style={{ border: '1px solid #94a3b8' }}>
                      {auto.placa}
                    </span>
                  </td>
                  <td>
                    <strong>R$ {Number(auto.valorDiaria).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>/dia
                  </td>
                  <td>
                    {renderBadgeProprietario(auto.tipoProprietario)}
                    <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '0.2rem' }}>
                      Titular: {auto.nomeProprietario || 'Não informado'}
                    </div>
                  </td>
                  <td>
                    {auto.disponivel ? (
                      <span className="badge badge-success">Disponível</span>
                    ) : (
                      <span className="badge badge-danger">Alugado / Em Contrato</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalAberto && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="card-header">
              <h3 className="card-title">➕ Cadastrar Automóvel</h3>
              <button className="btn btn-outline btn-sm" onClick={() => setModalAberto(false)}>
                ✕ Fechar
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid-2">
                <div className="form-group">
                  <label>Matrícula *</label>
                  <input
                    className="form-control"
                    placeholder="Ex: MAT-2026-005"
                    value={form.matricula}
                    onChange={(e) => setForm({ ...form, matricula: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Placa *</label>
                  <input
                    className="form-control"
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
                  <label>Ano *</label>
                  <input
                    type="number"
                    className="form-control"
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
                    className="form-control"
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
                    <option value="EMPRESA">🏢 Empresa</option>
                    <option value="BANCO">🏦 Banco</option>
                    <option value="CLIENTE">👤 Cliente</option>
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
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setModalAberto(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  💾 Salvar Automóvel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

