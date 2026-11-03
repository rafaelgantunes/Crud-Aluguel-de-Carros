import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    try {
      const saved = localStorage.getItem('autorent_usuario');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const salvarLogin = (dadosUsuario) => {
    setUsuario(dadosUsuario);
    localStorage.setItem('autorent_usuario', JSON.stringify(dadosUsuario));
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('autorent_usuario');
  };

  const isCliente = usuario?.role === 'CLIENTE';
  const isAgente = usuario?.role === 'AGENTE_EMPRESA' || usuario?.role === 'AGENTE_BANCO';
  const isBanco = usuario?.role === 'AGENTE_BANCO';

  return (
    <AuthContext.Provider value={{ usuario, salvarLogin, logout, isCliente, isAgente, isBanco }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

