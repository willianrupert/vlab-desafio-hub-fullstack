import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          setUser({ name: email.split('@')[0], email: email, avatar: email[0].toUpperCase() });
          resolve();
        } else {
          reject(new Error("Preencha e-mail e senha."));
        }
        setLoading(false);
      }, 1000);
    });
  };

  // NOVA FUNÇÃO: Registro de Usuário
  const register = async (nome, email, password) => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (nome && email && password) {
          setUser({ name: nome.split(' ')[0], email: email, avatar: nome[0].toUpperCase() });
          resolve();
        } else {
          reject(new Error("Preencha todos os campos para criar a conta."));
        }
        setLoading(false);
      }, 1200);
    });
  };

  const loginGoogle = async () => {
    setLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        setUser({ name: "Avaliador", email: "avaliador@vlab.edu.br", avatar: "A" });
        setLoading(false);
        resolve();
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}