import React, { useState } from 'react';
import { Eye, EyeOff, Loader2, GraduationCap, UserCheck } from 'lucide-react';
import { useAuth } from './AuthProvider';

export default function AuthScreen() {
  const { login, register, loginGoogle, loginAvaliador, loading } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false); 
  
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegistering) {
        await register(nome, email, password);
      } else {
        await login(email, password);
      }
    } catch (err) {
      // Traduz erros comuns do Firebase para o usuário
      if (err.code === 'auth/invalid-credential') setError('E-mail ou senha incorretos.');
      else if (err.code === 'auth/email-already-in-use') setError('Este e-mail já está cadastrado.');
      else setError('Erro na autenticação. Verifique os dados.');
    }
  };

  return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", padding: "40px 20px" }}>
      <div style={{ width: "100%", maxWidth: "420px", background: "white", borderRadius: "24px", padding: "40px 30px", boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}>
        
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ display: "inline-flex", padding: "12px", background: "linear-gradient(135deg, #2563eb, #7c3aed)", borderRadius: "16px", marginBottom: "16px", boxShadow: "0 8px 16px rgba(37,99,235,0.2)" }}>
            <GraduationCap size={32} color="white" />
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", margin: "0 0 4px 0" }}>V-LAB Hub</h1>
          <p style={{ fontSize: "12px", color: "#64748b", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>
            {isRegistering ? "Criação de Conta" : "Acesso Restrito"}
          </p>
        </div>

        {error && (
          <div style={{ background: "#fee2e2", color: "#991b1b", padding: "12px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", marginBottom: "20px", textAlign: "center" }}>
            {error}
          </div>
        )}

        {/* ÁREA DOS BOTÕES EXTERNOS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
          <button type="button" onClick={loginGoogle} disabled={loading} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", background: "white", border: "1px solid #e2e8f0", padding: "12px", borderRadius: "12px", fontSize: "14px", fontWeight: "700", color: "#334155", cursor: "pointer", transition: "all 0.2s" }}>
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: "18px" }} />
            Continuar com Google
          </button>

          <button type="button" onClick={loginAvaliador} disabled={loading} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", background: "#f8fafc", border: "1px dashed #cbd5e1", padding: "12px", borderRadius: "12px", fontSize: "14px", fontWeight: "700", color: "#475569", cursor: "pointer", transition: "all 0.2s" }} title="Acesso rápido para avaliação">
            <UserCheck size={18} color="#2563eb" />
            Acesso Rápido do Avaliador
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }}></div>
          <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "600" }}>ou use seu e-mail</span>
          <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }}></div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {isRegistering && (
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>NOME COMPLETO</label>
              <input type="text" value={nome} onChange={e => setNome(e.target.value)} required style={{ width: "100%", boxSizing: "border-box", padding: "12px 16px", borderRadius: "10px", border: "1px solid #cbd5e1", outline: "none", fontSize: "14px" }} placeholder="Seu nome" />
            </div>
          )}

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>E-MAIL INSTITUCIONAL</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: "100%", boxSizing: "border-box", padding: "12px 16px", borderRadius: "10px", border: "1px solid #cbd5e1", outline: "none", fontSize: "14px" }} placeholder="nome@vlab.edu.br" />
          </div>

          <div style={{ position: "relative" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>SENHA</label>
            <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required style={{ width: "100%", boxSizing: "border-box", padding: "12px 40px 12px 16px", borderRadius: "10px", border: "1px solid #cbd5e1", outline: "none", fontSize: "14px" }} placeholder="••••••••" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "12px", top: "34px", background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button type="submit" disabled={loading} style={{ background: "#2563eb", color: "white", padding: "14px", borderRadius: "10px", border: "none", fontSize: "14px", fontWeight: "700", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", marginTop: "8px" }}>
            {loading ? <Loader2 size={18} className="animate-spin" /> : (isRegistering ? "Criar Minha Conta" : "Acessar Plataforma")}
          </button>
        </form>

        <button type="button" onClick={() => { setIsRegistering(!isRegistering); setError(''); }} style={{ width: "100%", background: "none", border: "none", color: "#475569", fontSize: "13px", fontWeight: "600", marginTop: "24px", cursor: "pointer", textDecoration: "underline" }}>
          {isRegistering ? "Já tenho uma conta. Fazer Login." : "Ainda não tem conta? Cadastre-se aqui."}
        </button>

      </div>
    </div>
  );
}