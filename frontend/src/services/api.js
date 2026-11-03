const API_BASE = 'http://localhost:8080/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const msg =
      (data && (data.mensagem || data.message)) ||
      (data && data.erros && Object.values(data.erros).join(' | ')) ||
      `Erro na requisição (${response.status})`;
    throw new Error(msg);
  }
  return data;
}

export const api = {
  // Autenticação e Agentes
  login: (credenciais) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(credenciais) }),
  registrarAgente: (dados) =>
    request('/auth/registro-agente', { method: 'POST', body: JSON.stringify(dados) }),
  listarBancos: () => request('/auth/bancos'),
  listarAgentes: () => request('/auth/agentes'),

  // CRUD de Clientes
  listarClientes: () => request('/clientes'),
  buscarCliente: (id) => request(`/clientes/${id}`),
  criarCliente: (dados) =>
    request('/clientes', { method: 'POST', body: JSON.stringify(dados) }),
  atualizarCliente: (id, dados) =>
    request(`/clientes/${id}`, { method: 'PUT', body: JSON.stringify(dados) }),
  excluirCliente: (id) =>
    request(`/clientes/${id}`, { method: 'DELETE' }),

  // Automóveis
  listarAutomoveis: () => request('/automoveis'),
  cadastrarAutomovel: (dados) =>
    request('/automoveis', { method: 'POST', body: JSON.stringify(dados) }),
  atualizarAutomovel: (id, dados) =>
    request(`/automoveis/${id}`, { method: 'PUT', body: JSON.stringify(dados) }),
  excluirAutomovel: (id) =>
    request(`/automoveis/${id}`, { method: 'DELETE' }),

  // Pedidos de Aluguel e Contratos
  listarPedidos: (clienteId) =>
    request(clienteId ? `/pedidos?clienteId=${clienteId}` : '/pedidos'),
  introduzirPedido: (dados) =>
    request('/pedidos', { method: 'POST', body: JSON.stringify(dados) }),
  modificarPedido: (id, dados) =>
    request(`/pedidos/${id}`, { method: 'PUT', body: JSON.stringify(dados) }),
  avaliarPedido: (id, dados) =>
    request(`/pedidos/${id}/avaliar`, { method: 'PATCH', body: JSON.stringify(dados) }),
  executarContrato: (id) =>
    request(`/pedidos/${id}/executar-contrato`, { method: 'PATCH' }),
  cancelarPedido: (id) =>
    request(`/pedidos/${id}/cancelar`, { method: 'PATCH' }),
};

