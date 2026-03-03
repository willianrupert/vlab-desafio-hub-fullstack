import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../../services/api';
import { Video, FileText, Link2, Trash2, Edit, ExternalLink, ChevronLeft, ChevronRight, Loader2, RotateCcw, Sparkles } from 'lucide-react';
import LessonGeneratorModal from '../lessonGenerator/LessonGeneratorModal';

export default function ResourceList({ onEdit }) {
  const [items, setItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  
  // Novo State para controlar a exibição do Modal de Geração de Aula
  const [generatorResourceTitle, setGeneratorResourceTitle] = useState(null);
  
  // Estados para o "Desfazer" com Countdown
  const [deletedToast, setDeletedToast] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const LIMIT = 6;

  const fetchResources = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getResources({ skip: page * LIMIT, limit: LIMIT });
      setItems(data.items || []);
      setTotalItems(data.total || 0);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchResources(); }, [fetchResources]);

  // A MÁGICA DO SOFT DELETE COM COUNTDOWN
  const handleDelete = (recurso) => {
    setItems(prev => prev.filter(r => r.id !== recurso.id));
    setTotalItems(prev => prev - 1);
    setCountdown(5); // Inicia em 5 segundos

    // Atualiza o número na tela a cada 1 segundo
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Apaga de verdade após 5 segundos
    const timer = setTimeout(async () => {
      await api.deleteResource(recurso.id);
      setDeletedToast(null);
    }, 5000); 

    setDeletedToast({ recurso, timer, interval });
  };

  const undoDelete = () => {
    if (deletedToast) {
      clearTimeout(deletedToast.timer);
      clearInterval(deletedToast.interval);
      setItems(prev => [deletedToast.recurso, ...prev].sort((a,b) => a.id - b.id));
      setTotalItems(prev => prev + 1);
      setDeletedToast(null);
    }
  };

  const totalPages = Math.max(1, Math.ceil(totalItems / LIMIT));

  const getBadgeStyle = (tipo) => {
    if (tipo === 'Vídeo') return { bg: "#dbeafe", color: "#1e40af", icon: <Video size={16}/> };
    if (tipo === 'PDF') return { bg: "#ffe4e6", color: "#9f1239", icon: <FileText size={16}/> };
    return { bg: "#ede9fe", color: "#5b21b6", icon: <Link2 size={16}/> };
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", position: "relative" }}>
      
      {/* Toast com Countdown Dinâmico */}
      {deletedToast && (
        <div style={{ background: "#0f172a", color: "white", padding: "12px 24px", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "fixed", bottom: "30px", right: "30px", zIndex: 100, boxShadow: "0 10px 25px rgba(0,0,0,0.2)", animation: "fadeIn 0.3s ease" }}>
          <span style={{ fontSize: "14px", fontWeight: "600" }}>
            Recurso movido para lixeira <span style={{ color: "#94a3b8", marginLeft: "4px"}}>({countdown}s)</span>
          </span>
          <button onClick={undoDelete} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.3)", color: "white", padding: "6px 12px", borderRadius: "8px", marginLeft: "15px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontWeight: "bold" }}>
            <RotateCcw size={14} /> Desfazer
          </button>
        </div>
      )}

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}><Loader2 size={32} color="#2563eb" className="animate-spin" style={{ animation: "spin 1s linear infinite" }} /></div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
          {items.map(r => {
            const badge = getBadgeStyle(r.tipo);
            return (
              <div key={r.id} style={{ background: "white", borderRadius: "16px", padding: "24px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: badge.bg, color: badge.color, padding: "4px 12px", borderRadius: "99px", fontSize: "12px", fontWeight: "700" }}>{badge.icon} {r.tipo}</span>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => onEdit(r)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", padding: "4px" }} title="Editar"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(r)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", padding: "4px" }} title="Excluir"><Trash2 size={16} /></button>
                  </div>
                </div>
                <h3 style={{ margin: 0, fontSize: "18px", color: "#0f172a", fontWeight: "700", lineHeight: "1.3" }}>{r.titulo}</h3>
                <p style={{ margin: 0, fontSize: "14px", color: "#64748b", lineHeight: "1.6", flex: 1 }}>{r.descricao}</p>
                
                {/* DIV PARA AGRUPAR OS BOTÕES NA BASE DO CARD */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px" }}>
                  <a href={r.link_url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px", background: "#f8fafc", color: "#2563eb", textDecoration: "none", padding: "10px", borderRadius: "8px", fontSize: "13px", fontWeight: "700", border: "1px solid #e2e8f0" }}>Acessar Material</a>
                  
                  {/* NOVO BOTÃO DE GERAR AULA */}
                  <button 
                    onClick={() => setGeneratorResourceTitle(r.titulo)}
                    style={{ 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', 
                      background: '#f5f3ff', color: '#8b5cf6', border: '1px solid #ddd6fe', 
                      padding: '10px', borderRadius: '8px', fontSize: '13px', 
                      fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#ede9fe'}
                    onMouseLeave={e => e.currentTarget.style.background = '#f5f3ff'}
                  >
                    <Sparkles size={16} /> Gerar Aula Otimizada
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Paginação */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "white", padding: "12px 20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
        <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", color: page === 0 ? "#cbd5e1" : "#2563eb", cursor: page === 0 ? "not-allowed" : "pointer", fontWeight: "600" }}><ChevronLeft size={18} /> Anterior</button>
        <span style={{ fontSize: "14px", color: "#64748b", fontWeight: "600" }}>Página {page + 1} de {totalPages}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1} style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", color: page >= totalPages - 1 ? "#cbd5e1" : "#2563eb", cursor: page >= totalPages - 1 ? "not-allowed" : "pointer", fontWeight: "600" }}>Próxima <ChevronRight size={18} /></button>
      </div>

      {/* O MODAL FICA AQUI NO FINAL (RENDERIZADO CONDICIONALMENTE) */}
      {generatorResourceTitle && (
        <LessonGeneratorModal 
          resourceTitle={generatorResourceTitle} 
          onClose={() => setGeneratorResourceTitle(null)} 
        />
      )}
    </div>
  );
}