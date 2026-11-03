import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import PedidosPage from './pages/PedidosPage';
import ClientesPage from './pages/ClientesPage';
import AutomoveisPage from './pages/AutomoveisPage';

function SistemaConteudo() {
  const { usuario } = useAuth();
  const [abaAtiva, setAbaAtiva] = useState('pedidos');

  // Restrição obrigatória: O sistema só pode ser utilizado após cadastro prévio e autenticação
  if (!usuario) {
    return <LoginPage />;
  }

  return (
    <div>
      <Navbar abaAtiva={abaAtiva} setAbaAtiva={setAbaAtiva} />
      <main className="container">
        {abaAtiva === 'pedidos' && <PedidosPage />}
        {abaAtiva === 'clientes' && <ClientesPage />}
        {abaAtiva === 'automoveis' && <AutomoveisPage />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SistemaConteudo />
    </AuthProvider>
  );
}

