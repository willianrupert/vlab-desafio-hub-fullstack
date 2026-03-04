import { useState, useRef, useEffect } from 'react';
import { Sparkles, Loader2, Plus, Save } from 'lucide-react';
import { api } from '../../services/api';
import { logger } from '../../utils/logger';

// Adiciona as props resourceToEdit e clearEdit
export default function ResourceForm({ onCreated, resourceToEdit, clearEdit }) {
  const [form, setForm] = useState({ titulo: "", tipo: "Vídeo", url: "", descricao: "", tags: "" });
  const [busy, setBusy] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [mensagem, setMensagem] = useState(null);
  const [tempoPensamento, setTempoPensamento] = useState(0);
  const timerInterval = useRef(null);

  // Se receber um recurso para editar, preenche o formulário
  useEffect(() => {
    if (resourceToEdit) {
      setForm({
        titulo: resourceToEdit.titulo,
        tipo: resourceToEdit.tipo,
        url: resourceToEdit.link_url,
        descricao: resourceToEdit.descricao,
        tags: resourceToEdit.tags ? resourceToEdit.tags.join(", ") : ""
      });
      setMensagem({ tipo: "info", texto: `Editando: ${resourceToEdit.titulo}` });
    } else {
      setForm({ titulo: "", tipo: "Vídeo", url: "", descricao: "", tags: "" });
      setMensagem(null);
    }
  }, [resourceToEdit]);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleAI = async () => {
    // Nova trava de segurança: Exige Título e URL
    if (!form.titulo.trim() || !form.url.trim()) {
      setMensagem({ tipo: "erro", texto: "Preencha o Título e a URL antes de usar a IA." });
      return;
    }
    
    setAiLoading(true);
    setMensagem(null);
    setTempoPensamento(0);
    
    // Inicia o cronômetro
    timerInterval.current = setInterval(() => {
      setTempoPensamento(prev => prev + 0.1);
    }, 100);

    logger.info("AI Request Triggered", { titulo: form.titulo, tipo: form.tipo, url: form.url });
    
    try {
      // Enviando a URL para o motor!
      const res = await api.smartAssist({ 
        titulo: form.titulo, 
        tipo: form.tipo, 
        url: form.url 
      });
      
      set("descricao", res.descricao);
      set("tags", Array.isArray(res.tags) ? res.tags.join(", ") : res.tags);
      setMensagem({ tipo: "sucesso", texto: "Descrição gerada com IA e Scraping!" });
    } catch (e) {
      setMensagem({ tipo: "erro", texto: e.message || "Erro ao contatar os serviços de Inteligência Artificial." });
    } finally {
      // Para o cronômetro
      clearInterval(timerInterval.current);
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.titulo.trim() || !form.url.trim()) {
      setMensagem({ tipo: "erro", texto: "Título e URL são obrigatórios." });
      return;
    }
    setBusy(true);
    try {
      const payload = { 
        ...form, 
        link_url: form.url, 
        tags: form.tags.split(",").map(t => t.trim()).filter(Boolean) 
      };
      
      if (resourceToEdit) {
        // Se estiver editando, chama o PUT
        await api.updateResource(resourceToEdit.id, payload);
        setMensagem({ tipo: "sucesso", texto: "Recurso atualizado com sucesso!" });
        if(clearEdit) clearEdit(); // Limpa o estado de edição
      } else {
        // Se for novo, chama o POST
        await api.createResource(payload);
        setMensagem({ tipo: "sucesso", texto: "Recurso cadastrado com sucesso!" });
        setForm({ titulo: "", tipo: "Vídeo", url: "", descricao: "", tags: "" });
      }
      
      if(onCreated) onCreated();
    } catch {
      setMensagem({ tipo: "erro", texto: "Erro ao salvar recurso no banco de dados." });
    } finally {
      setBusy(false);
    }
  };

  const inputStyle = { width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc", marginBottom: "15px" };

  return (
    <div style={{ background: "white", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
      <h2 style={{ color: "#1e293b", marginBottom: "20px" }}>Novo Recurso Educacional</h2>
      
      {mensagem && (
        <div style={{ padding: "10px", marginBottom: "15px", borderRadius: "6px", background: mensagem.tipo === "erro" ? "#fee2e2" : "#d1fae5", color: mensagem.tipo === "erro" ? "#991b1b" : "#065f46" }}>
          {mensagem.texto}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>Título *</label>
        <input style={inputStyle} value={form.titulo} onChange={e => set("titulo", e.target.value)} placeholder="Ex: Matemática Financeira" />

        {/* RESTAURANDO O TIPO E A URL QUE HAVIAM SUMIDO */}
        <div style={{ display: "flex", gap: "15px" }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>Tipo *</label>
            <select style={inputStyle} value={form.tipo} onChange={e => set("tipo", e.target.value)}>
              <option>Vídeo</option><option>PDF</option><option>Link</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>URL *</label>
            <input type="url" style={inputStyle} value={form.url} onChange={e => set("url", e.target.value)} placeholder="https://..." />
          </div>
        </div>

        {/* BLOCO ÚNICO DO BOTÃO DA IA COM O TIMER */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
          <label style={{ fontWeight: "bold" }}>Descrição</label>
          
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {aiLoading && (
              <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", fontFamily: "monospace", background: "#f1f5f9", padding: "4px 8px", borderRadius: "6px" }}>
                ⏱️ {tempoPensamento.toFixed(1)}s
              </span>
            )}
            
            <button type="button" onClick={handleAI} disabled={aiLoading} 
              style={{ 
                display: "flex", alignItems: "center", gap: "8px", 
                background: aiLoading ? "#e2e8f0" : "linear-gradient(135deg, #7c3aed, #9333ea)", 
                color: aiLoading ? "#64748b" : "white", 
                border: "none", padding: "8px 14px", borderRadius: "8px", 
                cursor: aiLoading ? "not-allowed" : "pointer",
                fontWeight: "600", transition: "all 0.2s"
              }}>
              {aiLoading ? (
                <>
                  <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                  Processando...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Gerar com IA
                </>
              )}
            </button>
          </div>
        </div>
        <textarea style={{ ...inputStyle, minHeight: "100px" }} value={form.descricao} onChange={e => set("descricao", e.target.value)} />

        <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>Tags (separadas por vírgula)</label>
        <input style={inputStyle} value={form.tags} onChange={e => set("tags", e.target.value)} placeholder="matemática, finanças, juros" />

        <button type="submit" disabled={busy} style={{ width: "100%", background: "#1d4ed8", color: "white", border: "none", padding: "12px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }}>
          {busy ? <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> : <Plus size={18} />}
          Cadastrar Recurso
        </button>
      </form>
    </div>
  );
}