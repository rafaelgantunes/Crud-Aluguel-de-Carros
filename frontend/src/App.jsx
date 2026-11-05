import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import PedidosPage from './pages/PedidosPage';
import ClientesPage from './pages/ClientesPage';
import AutomoveisPage from './pages/AutomoveisPage';
import DesignSystemPage from './pages/DesignSystemPage';

function SistemaConteudo() {
  const { usuario } = useAuth();
  const [abaAtiva, setAbaAtiva] = useState('pedidos');
  const [verDesignSystemPublico, setVerDesignSystemPublico] = useState(false);

  if (!usuario) {
    if (verDesignSystemPublico) {
      return <DesignSystemPage onVoltar={() => setVerDesignSystemPublico(false)} />;
    }
    return <LoginPage onAbrirDesignSystem={() => setVerDesignSystemPublico(true)} />;
  }

  if (abaAtiva === 'design-system') {
    return <DesignSystemPage onVoltar={() => setAbaAtiva('pedidos')} />;
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
