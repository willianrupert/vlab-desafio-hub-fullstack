# 🎓 V-LAB Hub Educacional

> **Hub Inteligente de Recursos Educacionais** — Documentação Técnica Completa  
> Desafio Técnico Fullstack — V-LAB

![Python](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python%203.11-009688)
![React](https://img.shields.io/badge/Frontend-React%2019%20%7C%20Vite-61DAFB)
![AI](https://img.shields.io/badge/IA-Gemini%202.5%20Flash%20%7C%20GPT--4o--mini-8B5CF6)
![Firebase](https://img.shields.io/badge/Auth-Firebase-FFCA28)
![CI](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF)
![Status](https://img.shields.io/badge/Status-Concluído-success)

---

## ⚡ Projeto em Produção + Integração com Motor de IA

Este projeto foi além dos requisitos do desafio Fullstack.

Além da entrega técnica solicitada, foi desenvolvido e publicado em produção um **Motor de Engenharia de Prompts independente**, hospedado em domínio próprio e integrado em tempo real ao Hub Educacional.

### Ambientes Publicados

| Projeto | Domínio | Função |
|---|---|---|
|  **Hub Fullstack (este repositório)** | [`edu.rlight.com.br`](https://edu.rlight.com.br) | Plataforma educacional completa com autenticação, CRUD e Smart Assist |
|  **Motor de IA (projeto complementar)** | [`ia.rlight.com.br`](https://ia.rlight.com.br) | API FastAPI responsável por gerar aulas pedagógicas personalizadas |

---

##  Integração Real entre os Projetos

O recurso **Smart Assist** do Hub Fullstack consome diretamente a API:

https://ia.rlight.com.br/gerar_aula

Essa integração demonstra:

- ✅ Comunicação entre domínios distintos  
- ✅ Configuração de CORS em produção  
- ✅ Backend FastAPI desacoplado  
- ✅ Consumo de API externa no frontend React  
- ✅ Deploy real com CI/CD  
- ✅ Arquitetura modular e escalável  

---

## Diferencial Técnico

Ao invés de simular uma API ou usar mocks locais, foi implementado:

- Dois projetos independentes  
- Dois domínios públicos  
- Dois pipelines de deploy  
- Integração real via HTTPS  
- Configuração de servidor Linux (OCI)  
- Nginx + SSL  
- GitHub Actions para CI/CD  

Isso transforma o desafio técnico em uma **arquitetura full-stack real em produção**, demonstrando visão além do escopo solicitado.
---
## Sumário

1. [Visão Geral](#1-visão-geral)
2. [Arquitetura e Fluxo do Sistema](#2-arquitetura-e-fluxo-do-sistema)
3. [Estrutura do Repositório](#3-estrutura-do-repositório)
4. [Como Executar Localmente](#4-como-executar-localmente)
5. [Referência da API](#5-referência-da-api)
6. [Modelo de Banco de Dados](#6-modelo-de-banco-de-dados)
7. [Integração com Inteligência Artificial](#7-integração-com-inteligência-artificial)
8. [Recursos Modernos da Linguagem](#8-recursos-modernos-da-linguagem)
9. [DevOps & CI/CD](#9-devops--cicd)
10. [Acessibilidade](#10-acessibilidade)
11. [Testes Automatizados](#11-testes-automatizados)
12. [Variáveis de Ambiente](#12-variáveis-de-ambiente)
13. [Checklist de Requisitos do Edital](#13-checklist-de-requisitos-do-edital)
14. [Stack Tecnológica Completa](#14-stack-tecnológica-completa)

---

## 1. Visão Geral

O V-LAB Hub Educacional é uma aplicação Fullstack desenvolvida como resposta ao desafio técnico proposto. A plataforma atua como um repositório centralizado de materiais didáticos com um diferencial fundamental: um **assistente pedagógico integrado baseado em IA Generativa** que não se limita ao título do recurso — ele **lê o conteúdo real da URL** (transcrições de vídeos do YouTube ou texto de páginas web) para gerar descrições ricas, precisas e informativas, mencionando autores, tópicos reais e a tese central do material.

A arquitetura foi projetada com separação clara de responsabilidades entre frontend e backend, autenticação real via Firebase, banco de dados relacional com ORM, pipeline de CI/CD e múltiplas camadas de observabilidade.

### Funcionalidades Entregues

| Funcionalidade | Status |
|---|---|
| CRUD Completo (Recursos) | ✅ Create, Read (paginado), Update e Delete com Soft Delete (Undo) |
| Smart Assist com Web Scraping | ✅ Extrai transcrição do YouTube ou texto de páginas web antes de chamar a IA |
| IA com Fallback Automático | ✅ Gemini 2.5 Flash com fallback automático para GPT-4o-mini |
| Autenticação Firebase | ✅ Login e-mail/senha + OAuth2 Google + Acesso Rápido Avaliador |
| Gerador de Aula Contextual (Extra) | ✅ Modal recebe título + descrição rica do recurso para gerar plano de aula |
| CI/CD GitHub Actions | ✅ Linting (flake8) + Testes (pytest) a cada Push/PR |
| Deploy Automático | ✅ SSH para Oracle Cloud VM ao fazer merge na branch main |
| Acessibilidade (WCAG) | ✅ VLibras nativo, alto contraste, ajuste de fonte, skip links |
| Observabilidade / Logs | ✅ Decorator `@log_ai_request` com latência, tokens e provedor |
| Health Check Endpoint | ✅ `GET /health` retorna status 200 com payload JSON |
| Testes Automatizados | ✅ 5 testes cobrindo health, CRUD, paginação e Smart Assist (mock) |

---

## 2. Arquitetura e Fluxo do Sistema

### 2.1 Diagrama de Camadas

```
┌─────────────────────────────────────────────────────────────────┐
│                        BROWSER / SPA                            │
│   React 19 + Vite                                               │
│   AuthProvider  →  AuthScreen  →  Dashboard                     │
│   ResourceForm  →  ResourceList  →  LessonGeneratorModal        │
└──────────────────────┬──────────────────────────────────────────┘
                       │  HTTPS (Axios) — envia titulo + tipo + url
┌──────────────────────▼──────────────────────────────────────────┐
│                     FASTAPI (Python 3.11)                        │
│   /api/resources     (CRUD + Paginação)                          │
│   /api/smart-assist  (Scraping → IA → Fallback)                  │
│   /api/docentes      (Sincronização Firebase → SQLite)           │
│   /gerar_aula        (Motor de Aula Personalizada)               │
│   /health            (DevOps Health Check)                       │
└──────┬──────────────────────────────┬───────────────────────────┘
       │                              │
┌──────▼───────┐        ┌─────────────▼───────────────────────────┐
│  SQLite DB   │        │            AI Manager                   │
│  (SQLAlchemy)│        │                                         │
│  recursos    │        │  1. extract_youtube_transcript(url)     │
│  docentes    │        │     OR extract_webpage_text(url)        │
└──────────────┘        │                                         │
                        │  2. build_smart_assist_prompt(          │
                        │       title, type, scraped_content)     │
                        │                                         │
                        │  3. call_gemini()  →  call_openai()     │
                        │     (fallback automático)               │
                        └─────────────────────────────────────────┘
```

### 2.2 Fluxo Completo — Smart Assist com Scraping

Esta é a principal evolução do sistema. O Smart Assist agora opera em 3 fases antes de gerar qualquer descrição:

```
1. Usuário preenche Título, Tipo e URL no formulário.
   → O botão [Gerar com IA] só é habilitado se ambos estiverem preenchidos.

2. Frontend dispara: POST /api/smart-assist
   { titulo: 'Clean Code', tipo: 'Vídeo', url: 'https://youtube.com/watch?v=...' }

3. FastAPI valida o payload com Pydantic (SmartAssistRequest).
4. @log_ai_request captura o timestamp de início.

── FASE 1: SCRAPING ──────────────────────────────────────────────
5. manager.py inspeciona a URL:
   - Se contiver "youtube.com" ou "youtu.be":
     → extract_youtube_transcript(url)
       · Extrai video_id via regex
       · YouTubeTranscriptApi.fetch() com prioridade: ['pt-BR','pt','en','es']
       · Fallback: lista todas as legendas disponíveis e usa a primeira
       · Normaliza dicts E objetos (compatível com youtube-transcript-api v1.2+)
       · Retorna até 15.000 caracteres
   - Caso contrário (artigo, PDF online, etc.):
     → extract_webpage_text(url)
       · requests.get() com headers de navegador real (evita 403)
       · BeautifulSoup remove <script>, <style>, <nav>, <footer>, <header>
       · Retorna texto limpo com até 15.000 caracteres

── FASE 2: PROMPT ENGINEERING ────────────────────────────────────
6. build_smart_assist_prompt(titulo, tipo, scraped_content)
   - Com conteúdo: instrui a citar tese central, tópicos específicos
     e autor/palestrante identificável.
   - Sem conteúdo (scraping falhou): inferência apenas pelo título.

── FASE 3: GERAÇÃO COM IA ────────────────────────────────────────
7. call_gemini(prompt) → gemini-2.5-flash
   Se falhar → call_openai(prompt) → gpt-4o-mini (fallback)
   Se ambos falharem → HTTP 503

8. @log_ai_request registra:
   [INFO] AI Request: Title="Clean Code", Provider="Gemini",
          Fallback=False, TokenUsage=150, Latency=2.31s

9. Resposta { descricao, tags } preenchida no formulário.
   A descrição agora menciona autor, tópicos reais e tese do material.
```

### 2.3 Fluxo de Autenticação

```
OPÇÃO A — E-mail / Senha:
  1. AuthScreen → signInWithEmailAndPassword(auth, email, pass) → Firebase
  2. Firebase retorna UserCredential → setUser() → App renderiza Dashboard

OPÇÃO B — Google OAuth2:
  1. AuthScreen → signInWithPopup(auth, googleProvider) → Firebase
  2. Firebase retorna UserCredential com displayName e email
  3. Frontend → POST /api/docentes { nome, email, firebase_uid }
  4. Backend verifica se já existe; se não, insere no SQLite
  5. setUser() → App renderiza Dashboard

OPÇÃO C — Acesso Rápido Avaliador (modo demo):
  1. Clique no botão 'Acesso Rápido do Avaliador'
  2. Delay artificial de 800ms (simula loading)
  3. setUser({ name: 'Avaliador', email: 'avaliador@vlab.edu.br' })
  4. Dashboard disponível sem credenciais reais
```

### 2.4 Gerador de Aula — Contexto Enriquecido

O `LessonGeneratorModal` agora recebe não apenas o título do recurso, mas também a `descricao` gerada pela IA (que já contém os tópicos reais extraídos via scraping). Essa descrição é repassada ao payload do `/gerar_aula`, tornando os planos de aula muito mais específicos e relevantes ao conteúdo real do material.

```
ResourceList → setGeneratorResource(r)      // objeto completo {id, titulo, descricao, ...}
     ↓
LessonGeneratorModal({ resourceTitle, resourceDescription })
     ↓
payload = { aluno: {...}, topico: resourceTitle, descricao_material: resourceDescription }
     ↓
POST /gerar_aula → Plano de aula contextualizado
```

### 2.5 Soft Delete com Undo (Optimistic UI)

```
1. Usuário clica em [Excluir] → item removido do estado React imediatamente.
2. Toast aparece com countdown de 5 segundos.
3. setTimeout de 5000ms dispara DELETE /api/resources/{id} no backend.
4. Se usuário clicar em [Desfazer]:
   → clearTimeout (cancela o DELETE real)
   → clearInterval (para o contador visual)
   → Item restaurado no estado React sem nenhuma requisição extra.
```

---

## 3. Estrutura do Repositório

```
vlab-desafio-hub-fullstack/
├── .github/
│   └── workflows/
│       ├── ci.yml              # Lint + Testes a cada push/PR
│       └── deploy.yml          # Deploy SSH automático → Oracle Cloud
│
├── backend/
│   ├── ai/
│   │   ├── gemini_provider.py  # Integração Google Gemini 2.5 Flash
│   │   ├── openai_provider.py  # Fallback GPT-4o-mini
│   │   ├── manager.py          # Scraping (YouTube + Web) + Strategy + Fallback
│   │   └── prompts.py          # Prompt Engineering contextual (pt-BR, JSON)
│   ├── database.py             # SQLAlchemy engine + modelos ORM
│   ├── main.py                 # Rotas FastAPI + Middleware + Decorators
│   └── schemas.py              # Pydantic schemas + Enums (url opcional no SmartAssist)
│
├── frontend/
│   └── src/
│       ├── features/
│       │   ├── auth/               # AuthProvider (Context) + AuthScreen
│       │   ├── lessonGenerator/    # Modal recebe titulo + descricao do recurso
│       │   └── resources/
│       │       ├── ResourceForm.jsx    # Exige URL antes de ativar o botão de IA
│       │       └── ResourceList.jsx    # Passa objeto completo ao modal de aula
│       ├── services/
│       │   ├── api.js              # smartAssist agora envia { titulo, tipo, url }
│       │   └── firebase.js
│       └── utils/
│           └── logger.js
│
├── tests/
│   └── test_api.py             # 5 testes pytest
│
├── requirements.txt            # + beautifulsoup4, requests, youtube-transcript-api
└── README.md
```

---

## 4. Como Executar Localmente

### 4.1 Pré-requisitos

| Ferramenta | Versão recomendada |
|---|---|
| Python | 3.11+ |
| Node.js | 18+ (LTS) |
| npm | 9+ |
| Git | Qualquer versão recente |
| Conta Firebase | Gratuita (Authentication habilitado) |
| Chave Gemini API | Gratuita — aistudio.google.com |
| Chave OpenAI API | Opcional (apenas para fallback) |

### 4.2 Passo 1 — Clonar o repositório

```bash
git clone https://github.com/willianrupert/vlab-desafio-hub-fullstack.git
cd vlab-desafio-hub-fullstack
```

### 4.3 Passo 2 — Configurar e iniciar o Backend

```bash
# 1. Criar e ativar ambiente virtual
python -m venv .venv
source .venv/bin/activate          # Linux / macOS
.venv\Scripts\activate             # Windows (PowerShell)

# 2. Instalar dependências
# Inclui: beautifulsoup4, requests, youtube-transcript-api
pip install -r requirements.txt

# 3. Criar arquivo de variáveis de ambiente
cp .env.example .env
# Editar .env:
# GEMINI_API_KEY=sua_chave_aqui
# OPENAI_API_KEY=sua_chave_aqui  (opcional)

# 4. Iniciar o servidor FastAPI
python -m uvicorn backend.main:app --reload
```

> **Nota:** O banco de dados SQLite (`vlab_hub.db`) é criado automaticamente na primeira execução. Não é necessário rodar migrations.

URLs disponíveis após iniciar:
- **API:** `http://127.0.0.1:8000`
- **Swagger UI:** `http://127.0.0.1:8000/docs`
- **Health Check:** `http://127.0.0.1:8000/health`

### 4.4 Passo 3 — Configurar e iniciar o Frontend

```bash
cd frontend
npm install

cp .env.example .env
# Editar .env com as credenciais do Firebase (ver seção 12)

npm run dev
# Acesse: http://localhost:5173
```

> **Sem Firebase?** Use o botão **"Acesso Rápido do Avaliador"** na tela de login para entrar em modo demo.

### 4.5 Passo 4 — Executar os Testes

```bash
# Com o ambiente virtual ativado, na raiz do projeto:
pytest tests/ -v

# Saída esperada:
# tests/test_api.py::test_health_check_retorna_200      PASSED
# tests/test_api.py::test_criar_recurso_valido          PASSED
# tests/test_api.py::test_listagem_com_paginacao        PASSED
# tests/test_api.py::test_smart_assist_valido           PASSED
# tests/test_api.py::test_sincronizar_docente_novo      PASSED
# 5 passed in 0.XXs
```

---

## 5. Referência da API

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/health` | Health check. Retorna `{ status: "ok" }` |
| `POST` | `/api/resources` | Cria um novo recurso educacional |
| `GET` | `/api/resources` | Lista recursos com paginação (`skip`, `limit`) |
| `PUT` | `/api/resources/{id}` | Atualiza recurso existente pelo ID |
| `DELETE` | `/api/resources/{id}` | Remove recurso pelo ID (HTTP 204) |
| `POST` | `/api/smart-assist` | Scraping da URL + geração de descrição e tags via IA |
| `POST` | `/api/docentes` | Sincroniza usuário Firebase com o banco local |
| `POST` | `/gerar_aula` | Gera plano de aula personalizado via LLM |

### Exemplo — Smart Assist com URL (comportamento atual)

```json
// POST /api/smart-assist
{
  "titulo": "Clean Code - Escrevendo Código Limpo",
  "tipo": "Vídeo",
  "url": "https://www.youtube.com/watch?v=xyz123"
}

// Resposta 200 OK (baseada no conteúdo real da transcrição):
{
  "descricao": "Robert C. Martin apresenta os princípios fundamentais do Clean Code, demonstrando como nomenclatura expressiva, funções pequenas e ausência de comentários redundantes tornam o código autoexplicativo. O vídeo é indicado para desenvolvedores que desejam elevar a qualidade e a manutenibilidade de seus projetos.",
  "tags": ["clean-code", "boas-praticas", "refatoracao"]
}
```

```
// Log gerado no servidor:
[INFO] AI Request: Title="Clean Code - Escrevendo Código Limpo", Provider="Gemini",
       Fallback=False, TokenUsage=150, Latency=2.31s
```

### Exemplo — Smart Assist sem URL (fallback por inferência)

```json
// POST /api/smart-assist  (url omitida ou null)
{
  "titulo": "Introdução ao React",
  "tipo": "Vídeo"
}

// Resposta 200 OK (inferência pelo título):
{
  "descricao": "Apresenta os conceitos fundamentais do React, biblioteca JavaScript para construção de interfaces, abordando componentes, estado e ciclo de vida. Indicado para desenvolvedores iniciantes em desenvolvimento frontend moderno.",
  "tags": ["react", "frontend", "javascript"]
}
```

---

## 6. Modelo de Banco de Dados

### Tabela: `recursos`

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | INTEGER | Chave primária, autoincrement |
| `titulo` | STRING | Título do material didático (indexado) |
| `descricao` | STRING | Descrição gerada pela IA (com conteúdo real da URL) ou manual |
| `tipo` | STRING | Enum: `'Vídeo'`, `'PDF'`, `'Link'` |
| `link_url` | STRING | URL validada pelo Pydantic (`HttpUrl`) |
| `tags` | JSON | Lista de strings em JSON nativo do SQLite |

### Tabela: `docentes`

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | INTEGER | Chave primária, autoincrement |
| `nome` | STRING | Nome completo do docente |
| `email` | STRING | E-mail único (índice único) |
| `firebase_uid` | STRING | UID do Firebase (índice único) |

---

## 7. Integração com Inteligência Artificial

### 7.1 Arquitetura do AI Manager

O `manager.py` evoluiu para um pipeline de três etapas antes de qualquer chamada ao LLM:

| Etapa | Função | Comportamento |
|---|---|---|
| 1. Scraping | `extract_youtube_transcript(url)` | Detecta YouTube pela URL. Usa `YouTubeTranscriptApi` com prioridade `['pt-BR','pt','en','es']`. Fallback para a primeira legenda disponível. Compatível com dicts e objetos (API v1.2+). |
| 1. Scraping | `extract_webpage_text(url)` | Para qualquer outra URL. Usa `requests` com headers de navegador real. `BeautifulSoup` remove ruído (`<script>`, `<nav>`, `<footer>`). |
| 2. Prompt | `build_smart_assist_prompt()` | Constrói prompt diferente se há ou não `scraped_content`. Com conteúdo: exige citar tese, tópicos e autor. Sem conteúdo: inferência pelo título. |
| 3. LLM | `call_gemini()` → `call_openai()` | Padrão Strategy com fallback automático. |

### 7.2 Extração de Transcrição do YouTube

```python
def extract_youtube_transcript(url: str) -> str:
    video_id = re.search(r'(?:v=|\/)([0-9A-Za-z_-]{11})', url).group(1)
    ytt_api = YouTubeTranscriptApi()

    try:
        # Tenta os idiomas em ordem de prioridade
        transcript = ytt_api.fetch(video_id, languages=['pt-BR', 'pt', 'en', 'es'])
    except Exception:
        # Fallback: usa qualquer legenda disponível
        transcript_list = ytt_api.list(video_id)
        transcript = list(transcript_list)[0].fetch()

    # Compatível com youtube-transcript-api v1.2+:
    # versão nova retorna objetos com .text; versões antigas retornam dicts
    partes = []
    for t in transcript:
        if isinstance(t, dict):
            partes.append(t.get('text', ''))
        else:
            partes.append(getattr(t, 'text', ''))

    return " ".join(partes)[:15000]
```

### 7.3 Prompt Engineering Contextual

O prompt muda dinamicamente dependendo se houve scraping bem-sucedido:

**Com conteúdo extraído** — o modelo recebe o texto real e é instruído a:
- Frase 1: expor a tese ou argumento central do material
- Frase 2: citar 2-3 tópicos, técnicas ou conceitos efetivamente abordados
- Frase 3 (opcional): nomear o autor/palestrante se identificável no texto

**Sem conteúdo** (scraping falhou ou URL não fornecida):
- Frase 1: inferir o tema provável do material pelo título
- Frase 2: descrever o que o estudante provavelmente vai aprender

Restrições aplicadas em ambos os casos:
- Idioma obrigatório: pt-BR
- Proibido iniciar com "Este material", "Neste recurso" ou "Este vídeo/PDF/link"
- Proibido inventar autores ou tópicos não presentes no conteúdo ou no título
- Tags: exatamente 3, lowercase, sem repetir o tipo do recurso (`"vídeo"`, `"pdf"`)

### 7.4 Fallback Automático

```python
def generate_resource_metadata(title, resource_type, url=None):
    scraped_content = ""
    if url:
        if "youtube.com" in url or "youtu.be" in url:
            scraped_content = extract_youtube_transcript(url)
        else:
            scraped_content = extract_webpage_text(url)

    prompt = build_smart_assist_prompt(title, resource_type, scraped_content)

    try:
        data = call_gemini(prompt)
        return AIResult(..., provider="Gemini", fallback_used=False)
    except Exception as e:
        logger.warning(f"[WARN] Gemini falhou ({e}). Fallback para OpenAI...")
        try:
            data = call_openai(prompt)
            return AIResult(..., provider="OpenAI", fallback_used=True)
        except Exception:
            raise RuntimeError("Serviços de IA temporariamente indisponíveis.")
```

---

## 8. Recursos Modernos da Linguagem

### 8.1 Python

#### Dataclass (`AIResult`)

Padroniza o tráfego de dados internos com tipagem estrita e valores padrão:

```python
@dataclass
class AIResult:
    descricao: str
    tags: list[str]
    provider: str
    fallback_used: bool
    token_usage: int = field(default=150)
```

#### Decorator Avançado (`@log_ai_request`)

Captura métricas de latência, provedor e tokens sem poluir o código da rota. Note que a latência medida agora inclui o tempo de scraping + geração:

```python
def log_ai_request(func):
    @wraps(func)
    def wrapper(request: schemas.SmartAssistRequest, *args, **kwargs):
        start_time = time.time()
        resultado: AIResult = func(request, *args, **kwargs)
        latency = time.time() - start_time
        logger.info(
            f'[INFO] AI Request: Title="{request.titulo}", '
            f'Provider="{resultado.provider}", '
            f'Fallback={resultado.fallback_used}, '
            f'TokenUsage={resultado.token_usage}, Latency={latency:.2f}s'
        )
        return resultado
    return wrapper
```

#### Pydantic v2 — Campo Opcional na Evolução do Schema

A adição do campo `url` ao `SmartAssistRequest` foi feita de forma retrocompatível com `Optional`, sem quebrar o teste existente que não envia URL:

```python
class SmartAssistRequest(BaseModel):
    titulo: str          = Field(..., min_length=3)
    tipo:   TipoRecurso  = Field(...)
    url:    Optional[str] = Field(None, description="URL para scraping")
```

### 8.2 JavaScript / React

#### Guard no Botão de IA

O `ResourceForm` agora exige URL antes de permitir o Smart Assist:

```jsx
const handleAI = async () => {
  if (!form.titulo.trim() || !form.url.trim()) {
    setMensagem({ tipo: "erro", texto: "Preencha o Título e a URL antes de usar a IA." });
    return;
  }
  // api.smartAssist({ titulo, tipo, url })
};
```

#### Passagem de Contexto Rico para o Gerador de Aula

O `ResourceList` passou a guardar o objeto completo, permitindo que o modal receba a descrição enriquecida pelo scraping:

```jsx
// Antes:
const [generatorResourceTitle, setGeneratorResourceTitle] = useState(null);
onClick={() => setGeneratorResourceTitle(r.titulo)}

// Agora:
const [generatorResource, setGeneratorResource] = useState(null);
onClick={() => setGeneratorResource(r)}  // objeto completo

// No modal:
<LessonGeneratorModal
  resourceTitle={generatorResource.titulo}
  resourceDescription={generatorResource.descricao}
/>
```

#### Context API, `useCallback` e Logger (mantidos)

```jsx
// Auth centralizado sem prop drilling
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

// Busca otimizada — só recria quando 'page' muda
const fetchResources = useCallback(async () => { ... }, [page]);

// Logger colorido nas DevTools
export const logger = {
  info:  (m, d) => console.log(`%c[INFO] ${m}`,  "color:#3b82f6;font-weight:bold", d),
  error: (m, d) => console.error(`%c[ERROR] ${m}`,"color:#ef4444;font-weight:bold", d),
};
```

---

## 9. DevOps & CI/CD

### 9.1 Pipeline de Integração Contínua (`ci.yml`)

Executado a cada Push ou Pull Request nas branches `main`/`master`:

```
1. Checkout do código
2. Setup Python 3.11
3. pip install -r requirements.txt
   (inclui beautifulsoup4, requests, youtube-transcript-api)
4. flake8 — Análise de Sintaxe (E9, F63, F7, F82 → falha o build)
5. flake8 — Análise de Qualidade (max-line-length=127 → warning)
6. pytest tests/ — 5 testes (env: GEMINI_API_KEY=dummy_key)
```

### 9.2 Pipeline de Deploy (`deploy.yml`)

A cada push na branch `main`, deploy automático via SSH para a VM Oracle Cloud:

```
1. SSH na VM Oracle Cloud
2. git pull origin main
3. source .venv/bin/activate
4. pip install -r requirements.txt
5. sudo systemctl restart hub-backend

Secrets necessários:
  HOST            → IP da VM Oracle Cloud
  USERNAME        → Usuário SSH
  SSH_PRIVATE_KEY → Chave privada RSA/ED25519
```

### 9.3 Observabilidade

| Métrica | Implementação |
|---|---|
| Latência total (scraping + IA) | Medida pelo decorator `@log_ai_request` via `time.time()` |
| Provedor utilizado | Campo `provider` na `AIResult` (`Gemini` ou `OpenAI`) |
| Uso de fallback | Campo `fallback_used` boolean na `AIResult` |
| Tokens estimados | Campo `token_usage` na `AIResult` |
| Health Check | `GET /health` → `{ status: "ok", message: "API is running" }` |
| Logs de scraping | `logger.info()` com quantidade de caracteres extraídos |
| Logs de erro | `logger.error()` em todos os `except` críticos |

---

## 10. Acessibilidade

| Recurso | Implementação |
|---|---|
| VLibras (LIBRAS) | Widget oficial `vlibras.gov.br` integrado ao `index.html` |
| Alto Contraste | Classe CSS `alto-contraste` aplicada via JS no `<body>` |
| Ajuste de Fonte | `document.body.style.zoom` controlado pelos botões A- / A / A+ |
| Skip Links | Âncoras `#menu` / `#conteudo` / `#rodape` na barra de acessibilidade |
| Barra de Acessibilidade | Componente Gov.br padrão no topo de todas as páginas |
| Tags semânticas | `<header>`, `<main>`, `<footer>` com IDs para navegação |

---

## 11. Testes Automatizados

| Teste | O que valida |
|---|---|
| `test_health_check_retorna_200` | `/health` retorna 200 e payload correto |
| `test_criar_recurso_valido` | `POST /api/resources` retorna 201 com ID |
| `test_listagem_com_paginacao` | `GET /api/resources` retorna dict com `total` e `items` |
| `test_smart_assist_valido` | `POST /api/smart-assist` com mock retorna `descricao` e `tags` |
| `test_sincronizar_docente_novo` | `POST /api/docentes` salva docente e retorna 201 com ID |

O mock em `test_smart_assist_valido` substitui `generate_resource_metadata` inteiro — incluindo as chamadas de scraping — por um `AIResult` fixo, garantindo que o CI/CD passe sem acesso à internet ou chaves reais:

```python
@patch("backend.main.generate_resource_metadata")
def test_smart_assist_valido(mock_generate):
    mock_generate.return_value = AIResult(
        descricao="Descrição mockada para o teste de CI.",
        tags=["teste", "mock", "ci"],
        provider="MockedAPI",
        fallback_used=False
    )
    response = client.post("/api/smart-assist", json={
        "titulo": "Matemática Financeira", "tipo": "Vídeo"
    })
    assert response.status_code == 200
    assert response.json()["descricao"] == "Descrição mockada para o teste de CI."
```

---

## 12. Variáveis de Ambiente

### Backend (`.env` — raiz do projeto)

```env
GEMINI_API_KEY=sua_chave_gemini_aqui
OPENAI_API_KEY=sua_chave_openai_aqui   # Opcional (usado apenas no fallback)
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:8000/api
VITE_IA_API_URL=http://localhost:8000

# Firebase — obtenha em console.firebase.google.com
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc...
```

> ⚠️ **Segurança:** Nunca faça commit dos arquivos `.env`. Ambos estão no `.gitignore`. Use GitHub Secrets para produção.

---

## 13. Checklist de Requisitos do Edital

| Requisito | Status |
|---|---|
| CRUD — Listagem com paginação | ✅ `GET /api/resources?skip=N&limit=N` retorna `{ total, items }` |
| CRUD — Cadastro | ✅ `POST /api/resources` com validação Pydantic |
| CRUD — Edição | ✅ `PUT /api/resources/{id}` |
| CRUD — Exclusão | ✅ `DELETE /api/resources/{id}` + Soft Delete com Undo |
| Campos: Título, Descrição, Tipo, URL, Tags | ✅ Todos implementados e validados |
| Tipo restrito a: Vídeo, PDF, Link | ✅ Enum `TipoRecurso` no Pydantic |
| Botão "Gerar Descrição com IA" | ✅ Botão com spinner e cronômetro visual |
| Frontend envia Título + Tipo ao backend | ✅ `POST /api/smart-assist { titulo, tipo, url }` |
| Backend consulta API de LLM | ✅ Gemini 2.5 Flash + fallback GPT-4o-mini |
| Retorna descrição + 3 tags | ✅ `{ descricao, tags: [3 itens] }` |
| Frontend preenche campos automaticamente | ✅ `set('descricao', ...)` + `set('tags', ...)` |
| Prompt de Sistema eficiente | ✅ Persona + JSON estrito + pt-BR + anti-hallucination + scraping contextual |
| FastAPI + Pydantic | ✅ FastAPI 0.135.1 + Pydantic v2.12.5 |
| Banco de dados SQLite | ✅ SQLite + SQLAlchemy 2.0.47 |
| Variáveis de ambiente para chaves de API | ✅ `python-dotenv` + `.env` no `.gitignore` |
| SPA (Single Page Application) | ✅ React 19 + Vite |
| Loading state enquanto IA processa | ✅ `aiLoading` + ícone `Loader2` + cronômetro |
| Tratamento de erro se IA falhar | ✅ `try/catch` + mensagem visual + HTTP 503 |
| CI com linting a cada push | ✅ GitHub Actions flake8 (E9/F63/F7/F82) |
| Logs estruturados com TokenUsage e Latency | ✅ Decorator `@log_ai_request` |
| Endpoint `/health` | ✅ `GET /health` → `{ status: "ok" }` |
| README.md detalhado | ✅ Este documento |
| API Key não hardcoded | ✅ `load_dotenv()` + `os.getenv()` em todos os providers |

---

## 14. Stack Tecnológica Completa

### Backend

| Tecnologia | Versão | Uso |
|---|---|---|
| Python | 3.11+ | Linguagem principal |
| FastAPI | 0.135.1 | Framework web assíncrono |
| Pydantic | v2.12.5 | Validação e serialização |
| SQLAlchemy | 2.0.47 | ORM para SQLite |
| SQLite | Nativo | Banco de dados relacional |
| google-genai | 1.65.0 | SDK Google Gemini |
| openai | 2.24.0 | SDK OpenAI GPT |
| beautifulsoup4 | 4.14.3 | Scraping e parsing de HTML |
| requests | 2.32.5 | Requisições HTTP para scraping web |
| youtube-transcript-api | 1.2.4 | Extração de transcrições do YouTube |
| python-dotenv | 1.2.2 | Variáveis de ambiente |
| uvicorn | 0.41.0 | Servidor ASGI |
| pytest | 9.0.2 | Testes automatizados |
| httpx | 0.28.1 | Cliente HTTP para testes |

### Frontend

| Tecnologia | Versão | Uso |
|---|---|---|
| React | 19.2.0 | Biblioteca de UI |
| Vite | 7.3.1 | Build tool e dev server |
| Firebase | 12.10.0 | Autenticação (Email + Google) |
| Axios | 1.13.6 | Cliente HTTP |
| Lucide React | 0.576.0 | Ícones SVG |
| React Router DOM | 7.13.1 | Roteamento SPA |
| ESLint | 9.39.1 | Linting JavaScript |

### DevOps & Infraestrutura

| Tecnologia | Uso |
|---|---|
| GitHub Actions | CI/CD — Lint + Testes + Deploy automático |
| Oracle Cloud VM | Hospedagem do backend em produção |
| systemd | Gerenciamento do serviço `hub-backend` |
| flake8 | Análise estática de código Python |
| appleboy/ssh-action | Deploy remoto via SSH no GitHub Actions |

---

*© 2025 V-LAB Hub — Desenvolvido para o Desafio Técnico Fullstack V-LAB.*
