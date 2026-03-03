import React, { useState, useEffect } from 'react';
import { X, Sparkles, Loader2, BookOpen, Download, UserCheck } from 'lucide-react';
import './LessonModal.css';

// Mock temporário para gerar a interface. 
// Mais tarde, trocaremos essa função por uma chamada real à sua API na Oracle Cloud.
const mockGerarAula = async (params) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        titulo: `Aula: ${params.topic}`,
        perfil: params.profile,
        conteudo: `
# 📚 Explicando ${params.topic}

Bem-vindo à sua aula hiper-personalizada para o perfil: **${params.profile.nivel}** (${params.profile.estilo}).

### 🧠 Explicação Passo a Passo (Chain-of-Thought)
1. **O conceito central:** Para entendermos este tema, primeiro precisamos de olhar para as suas bases teóricas. 
2. **Aplicações:** No mundo real, isso funciona de forma dinâmica, ajudando profissionais a resolverem problemas complexos diariamente.

### 💡 Exemplo Prático
Imagine um cenário onde você tem apenas recursos limitados. A aplicação desta teoria resolve o impasse ao otimizar a rota de aprendizagem!

### 🗺️ Mapa Mental
\`\`\`
[ Conceito Central ]
       |
  +----+----+
  |         |
[Ideia 1] [Ideia 2]
\`\`\`

### ❓ Para Pensar...
Como é que você aplicaria este conceito na sua rotina de estudos atual?
        `
      });
    }, 4500); // Demora 4.5 segundos para simular a IA a pensar pesadamente
  });
};

export default function LessonGeneratorModal({ resourceTitle, onClose }) {
  const [step, setStep] = useState('form'); // 'form' | 'loading' | 'result'
  const [timer, setTimer] = useState(0);
  const [generatedLesson, setGeneratedLesson] = useState(null);

  // Estados do Perfil do Aluno
  const [idade, setIdade] = useState('15');
  const [nivel, setNivel] = useState('Intermediário');
  const [estilo, setEstilo] = useState('Visual');

  // Efeito do Temporizador
  useEffect(() => {
    let interval;
    if (step === 'loading') {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setStep('loading');
    setTimer(0);

    const payload = {
      topic: resourceTitle,
      profile: { idade, nivel, estilo }
    };

    try {
      const result = await mockGerarAula(payload);
      setGeneratedLesson(result);
      setStep('result');
    } catch (error) {
      console.error("Falha ao gerar aula", error);
      setStep('form'); // Volta se der erro
    }
  };

  const handleDownloadPDF = () => {
    // Implementação básica de download para fins de UI
    const element = document.createElement("a");
    const file = new Blob([generatedLesson.conteudo], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Plano_Aula_${resourceTitle.replace(/\s+/g, '_')}.md`; // Salvando como .md por enquanto
    document.body.appendChild(element); // Necessário para o Firefox
    element.click();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      {/* Impede que o modal feche ao clicar dentro dele */}
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        
        <div className="modal-header">
          <h3><Sparkles color="#8b5cf6" /> Gerador de Aula Otimizada</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          {/* PASSO 1: FORMULÁRIO */}
          {step === 'form' && (
            <form id="generatorForm" onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>Tópico Alvo</span>
                <p style={{ margin: '8px 0 0 0', fontWeight: '700', color: '#0f172a', fontSize: '18px' }}>{resourceTitle}</p>
              </div>

              <h4 style={{ margin: '0 0 -10px 0', fontSize: '16px', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserCheck size={18} /> Perfil do Aluno Alvo
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Idade</label>
                  <input type="number" value={idade} onChange={e => setIdade(e.target.value)} required style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Nível de Conhecimento</label>
                  <select value={nivel} onChange={e => setNivel(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', background: 'white' }}>
                    <option>Iniciante</option>
                    <option>Intermediário</option>
                    <option>Avançado</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Estilo de Aprendizado Principal</label>
                <select value={estilo} onChange={e => setEstilo(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', background: 'white' }}>
                  <option>Visual (Diagramas, vídeos)</option>
                  <option>Auditivo (Palestras, podcasts)</option>
                  <option>Leitura/Escrita (Textos longos, redações)</option>
                  <option>Cinestésico (Projetos práticos, mãos na massa)</option>
                </select>
              </div>
            </form>
          )}

          {/* PASSO 2: LOADING */}
          {step === 'loading' && (
            <div className="loading-box">
              <Loader2 size={48} color="#8b5cf6" className="animate-spin" />
              <div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#0f172a' }}>O Motor de IA está a criar a aula...</h4>
                <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Aplicando técnicas de Chain-of-Thought e Persona Prompting.</p>
              </div>
              <div className="loading-timer">00:{timer < 10 ? `0${timer}` : timer}s</div>
            </div>
          )}

          {/* PASSO 3: RESULTADO */}
          {step === 'result' && generatedLesson && (
            <div className="lesson-viewer">
              <h4 style={{ margin: '0 0 16px 0', color: '#8b5cf6', display: 'flex', alignItems: 'center', gap: '8px' }}><BookOpen size={20} /> Conteúdo Gerado</h4>
              {/* Uma forma brutalmente simples de renderizar quebras de linha e markdown básico num textarea ou pre */}
              <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                {generatedLesson.conteudo}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER FIXO (Os botões mudam conforme o step) */}
        <div className="modal-footer">
          {step === 'form' && (
            <>
              <button type="button" onClick={onClose} style={{ padding: '12px 24px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', color: '#475569', fontWeight: '600', cursor: 'pointer' }}>Cancelar</button>
              <button type="submit" form="generatorForm" style={{ padding: '12px 24px', borderRadius: '8px', border: 'none', background: '#8b5cf6', color: 'white', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><Sparkles size={16} /> Gerar Aula Personalizada</button>
            </>
          )}
          
          {step === 'loading' && (
            <button disabled style={{ padding: '12px 24px', borderRadius: '8px', border: 'none', background: '#cbd5e1', color: '#94a3b8', fontWeight: '600' }}>Gerando...</button>
          )}

          {step === 'result' && (
            <>
              <button type="button" onClick={() => setStep('form')} style={{ padding: '12px 24px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', color: '#475569', fontWeight: '600', cursor: 'pointer' }}>Gerar Outra Versão</button>
              <button type="button" onClick={handleDownloadPDF} style={{ padding: '12px 24px', borderRadius: '8px', border: 'none', background: '#10b981', color: 'white', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><Download size={18} /> Baixar PDF</button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}