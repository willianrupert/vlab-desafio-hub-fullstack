import React, { createContext, useContext, useState } from 'react';
import { auth, googleProvider } from '../../services/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { api } from '../../services/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const fbUser = userCredential.user;
      setUser({ name: fbUser.displayName || email.split('@')[0], email: fbUser.email, avatar: email[0].toUpperCase() });
    } finally {
      setLoading(false);
    }
  };

  const register = async (nome, email, password) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const fbUser = userCredential.user;
      
      // Salva no banco de dados Python!
      await api.syncDocente({ nome, email, firebase_uid: fbUser.uid });
      
      setUser({ name: nome.split(' ')[0], email: email, avatar: nome[0].toUpperCase() });
    } finally {
      setLoading(false);
    }
  };

  const loginGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const nome = fbUser.displayName || "Docente";
      
      // Salva ou atualiza no banco de dados Python
      await api.syncDocente({ nome, email: fbUser.email, firebase_uid: fbUser.uid });
      
      setUser({ name: nome.split(' ')[0], email: fbUser.email, avatar: nome[0].toUpperCase() });
    } finally {
      setLoading(false);
    }
  };

  // BOTÃO DE ACESSO RÁPIDO PARA O AVALIADOR
  const loginAvaliador = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800)); 
    setUser({ name: "Avaliador", email: "avaliador@vlab.edu.br", avatar: "A" });
    setLoading(false);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginGoogle, loginAvaliador, logout }}>
      {children}
    </AuthContext.Provider>
  );
}