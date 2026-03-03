import React, { useState, useEffect } from 'react';
import ResourceForm from './features/resources/ResourceForm';
import ResourceList from './features/resources/ResourceList';
import AuthScreen from './features/auth/AuthScreen';
import { useAuth } from './features/auth/AuthProvider';
import { GraduationCap, LayoutGrid, PlusCircle, LogOut } from 'lucide-react';

export default function App() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('list');
  const [fontSize, setFontSize] = useState(100); 
  const [highContrast, setHighContrast] = useState(false);
  const [resourceToEdit, setResourceToEdit] = useState(null);

  useEffect(() => {
    document.body.style.zoom = `${fontSize}%`;
    if (highContrast) document.body.classList.add('alto-contraste');
    else document.body.classList.remove('alto-contraste');
  }, [fontSize, highContrast]);

  const handleEditClick = (recurso) => {
    setResourceToEdit(recurso);
    setActiveTab('form');
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f8fafc" }}>
      
      {/* 1. BARRA GLOBAL DE ACESSIBILIDADE (Padrão Gov.br) */}
      <div className="barra-acessibilidade" style={{ background: "#f1f5f9", padding: "8px 5%", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", color: "#475569", fontWeight: "600", borderBottom: "1px solid #e2e8f0", flexWrap: "wrap", gap: "10px" }}>
        
        {/* Bloco Esquerdo: Controles */}
        <div style={{ display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ textTransform: "uppercase", letterSpacing: "0.05em", fontSize: "11px" }}>Acessibilidade</span>
          
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span>Contraste</span>
            <button onClick={() => setHighContrast(false)} style={{ width: "16px", height: "16px", borderRadius: "50%", background: "white", border: "2px solid #94a3b8", cursor: "pointer" }} title="Contraste Padrão"></button>
            <button onClick={() => setHighContrast(true)} style={{ width: "16px", height: "16px", borderRadius: "50%", background: "#0f172a", border: "none", cursor: "pointer" }} title="Alto Contraste"></button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span style={{ marginRight: "4px" }}>Tamanho da letra</span>
            <button onClick={() => setFontSize(prev => Math.max(prev - 10, 80))} style={{ border: "1px solid #cbd5e1", background: "white", padding: "2px 6px", cursor: "pointer", borderRadius: "4px", color: "#0f172a" }}>A-</button>
            <button onClick={() => setFontSize(100)} style={{ border: "1px solid #cbd5e1", background: "white", padding: "2px 6px", cursor: "pointer", borderRadius: "4px", color: "#0f172a" }}>A</button>
            <button onClick={() => setFontSize(prev => Math.min(prev + 10, 150))} style={{ border: "1px solid #cbd5e1", background: "white", padding: "2px 6px", cursor: "pointer", borderRadius: "4px", color: "#0f172a" }}>A+</button>
          </div>
        </div>

        {/* Bloco Central: Atalhos (Note os hrefs apontando para os IDs) */}
        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
          <a href="#menu" style={{ color: "#2563eb", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => e.target.style.textDecoration = "underline"} onMouseLeave={e => e.target.style.textDecoration = "none"}>Ir para o menu [1]</a>
          <a href="#conteudo" style={{ color: "#2563eb", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => e.target.style.textDecoration = "underline"} onMouseLeave={e => e.target.style.textDecoration = "none"}>Ir para o conteúdo [2]</a>
          <a href="#rodape" style={{ color: "#2563eb", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => e.target.style.textDecoration = "underline"} onMouseLeave={e => e.target.style.textDecoration = "none"}>Ir para o rodapé [3]</a>
        </div>

        {/* Bloco Direito: Idioma */}
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <span style={{ fontWeight: "700" }}>Português | BR</span>
        </div>
      </div>

      {/* 2. ROTEAMENTO DE TELAS (Login vs Painel Interno) */}
      {!user ? (
        
        <AuthScreen />
        
      ) : (

        <>
          {/* DICA NINJA: id="menu" AQUI! */}
          <header id="menu" style={{ backgroundColor: "#1e293b", padding: "16px 5%", display: "flex", alignItems: "center", justifyContent: "space-between", color: "white", position: "sticky", top: 0, zIndex: 50 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <div style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)", padding: "10px", borderRadius: "12px" }}>
                <GraduationCap size={24} color="white" />
              </div>
              <div>
                <h1 style={{ margin: 0, fontSize: "20px", fontWeight: "800", letterSpacing: "-0.5px" }}>V-LAB Hub</h1>
                <span style={{ fontSize: "10px", color: "#94a3b8", fontWeight: "bold", textTransform: "uppercase" }}>Portal Educacional</span>
              </div>
            </div>
            <button onClick={logout} style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "white", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "14px" }}>
              <LogOut size={16} /> Sair
            </button>
          </header>

          {/* DICA NINJA: id="conteudo" AQUI! */}
          <main id="conteudo" style={{ width: "100%", maxWidth: "1200px", margin: "0 auto", padding: "40px 5%", flex: 1 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginBottom: "40px" }}>
              <div>
                <h2 style={{ fontSize: "32px", fontWeight: "800", color: "#0f172a", margin: "0 0 8px 0" }}>Plataforma de Materiais</h2>
                <p style={{ color: "#64748b", margin: 0, fontSize: "16px" }}>Explore o acervo digital ou gerencie recursos pedagógicos.</p>
              </div>
              
              <div style={{ display: "inline-flex", background: "white", padding: "6px", borderRadius: "99px", border: "1px solid #e2e8f0", width: "fit-content" }}>
                <button style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 24px", borderRadius: "99px", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: "700", background: activeTab === 'list' ? "#2563eb" : "transparent", color: activeTab === 'list' ? "white" : "#64748b" }} onClick={() => { setActiveTab('list'); setResourceToEdit(null); }}>
                  <LayoutGrid size={18} /> Acervo Completo
                </button>
                <button style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 24px", borderRadius: "99px", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: "700", background: activeTab === 'form' ? "#2563eb" : "transparent", color: activeTab === 'form' ? "white" : "#64748b" }} onClick={() => setActiveTab('form')}>
                  <PlusCircle size={18} /> {resourceToEdit ? 'Editar Recurso' : 'Novo Recurso'}
                </button>
              </div>
            </div>
            
            <div>
              {activeTab === 'list' ? (
                <ResourceList onEdit={handleEditClick} />
              ) : (
                <div style={{ maxWidth: "700px" }}>
                  <ResourceForm onCreated={() => { setActiveTab('list'); setResourceToEdit(null); }} resourceToEdit={resourceToEdit} clearEdit={() => setResourceToEdit(null)} />
                </div>
              )}
            </div>
          </main>
        </>
      )}

      {/* 3. FOOTER INSTITUCIONAL (Fica sempre visível no final) */}
      {/* DICA NINJA: id="rodape" AQUI! */}
      <footer id="rodape" style={{ backgroundColor: "#1e293b", color: "#94a3b8", padding: "30px 5%", borderTop: "4px solid #2563eb", marginTop: "auto" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "white", fontWeight: "bold" }}>
            <GraduationCap size={20} color="#3b82f6" />
            V-LAB Hub Educacional
          </div>
          <p style={{ margin: 0, fontSize: "14px", textAlign: "center", maxWidth: "600px", lineHeight: "1.6" }}>
            Desenvolvido para gestão inteligente de materiais didáticos. Integrado com IA generativa para automação de metadados e categorização.
          </p>
          <div style={{ width: "100%", height: "1px", backgroundColor: "rgba(255,255,255,0.1)", margin: "15px 0" }}></div>
          <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>
            &copy; {new Date().getFullYear()} V-LAB Hub. Todos os direitos reservados.
          </p>
        </div>
      </footer>

    </div>
  );
}