
Willian Rupert <willianrupert@gmail.com>
11:15 (há 1 hora)
para mim

# 🎓 V-LAB Hub Educacional

> **Hub Inteligente de Recursos Educacionais** — Documentação Técnica Completa
> Desafio Técnico Fullstack — V-LAB

![Python](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python%203.11-009688)
![React](https://img.shields.io/badge/Frontend-React%2019%20%7C%20Vite-61DAFB)
![AI](https://img.shields.io/badge/IA-Gemini%202.5%20Flash%20%7C%20GPT--4o--mini-8B5CF6)
![Firebase](https://img.shields.io/badge/Auth-Firebase-FFCA28)
![CI](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF)
![Status](https://img.shields.io/badge/Status-Concluído-success)

-----

## Sumário

1. [Visão Geral](#1-visão-geral)
1. [Arquitetura e Fluxo do Sistema](#2-arquitetura-e-fluxo-do-sistema)
1. [Estrutura do Repositório](#3-estrutura-do-repositório)
1. [Como Executar Localmente](#4-como-executar-localmente)
1. [Referência da API](#5-referência-da-api)
1. [Modelo de Banco de Dados](#6-modelo-de-banco-de-dados)
1. [Integração com Inteligência Artificial](#7-integração-com-inteligência-artificial)
1. [Recursos Modernos da Linguagem](#8-recursos-modernos-da-linguagem)
1. [DevOps & CI/CD](#9-devops--cicd)
1. [Acessibilidade](#10-acessibilidade)
1. [Testes Automatizados](#11-testes-automatizados)
1. [Variáveis de Ambiente](#12-variáveis-de-ambiente)
1. [Checklist de Requisitos do Edital](#13-checklist-de-requisitos-do-edital)
1. [Stack Tecnológica Completa](#14-stack-tecnológica-completa)

-----

## 1. Visão Geral

O V-LAB Hub Educacional é uma aplicação Fullstack desenvolvida como resposta ao desafio técnico proposto. A plataforma atua como um repositório centralizado de materiais didáticos com um diferencial fundamental: um **assistente pedagógico integrado baseado em IA Generativa**, capaz de gerar automaticamente descrições e tags de categorização para novos recursos com base em seu título e tipo.

A arquitetura foi projetada com separação clara de responsabilidades entre frontend e backend, autenticação real via Firebase, banco de dados relacional com ORM, pipeline de CI/CD e múltiplas camadas de observabilidade — todos os pontos exigidos pelo edital, além de diferenciais de nível sênior.

### Funcionalidades Entregues

|Funcionalidade |Status |
|------------------------|-----------------------------------------------------------------|
|CRUD Completo (Recursos)|✅ Create, Read (paginado), Update e Delete com Soft Delete (Undo)|
|Smart Assist — IA |✅ Gemini 2.5 Flash com fallback automático para GPT-4o-mini |
|Autenticação Firebase |✅ Login e-mail/senha + OAuth2 Google + Acesso Rápido Avaliador |
|Gerador de Aula (Extra) |✅ Modal com Chain-of-Thought para planos de aula personalizados |
|CI/CD GitHub Actions |✅ Linting (flake8) + Testes (pytest) a cada Push/PR |
|Deploy Automático |✅ SSH para Oracle Cloud VM ao fazer merge na branch main |
|Acessibilidade (WCAG) |✅ VLibras nativo, alto contraste, ajuste de fonte, skip links |
|Observabilidade / Logs |✅ Decorator `@log_ai_request` com latência, tokens e provedor |
|Health Check Endpoint |✅ `GET /health` retorna status 200 com payload JSON |
|Testes Automatizados |✅ 5 testes cobrindo health, CRUD, paginação e Smart Assist (mock)|

-----

## 2. Arquitetura e Fluxo do Sistema

### 2.1 Diagrama de Camadas

```
┌─────────────────────────────────────────────────────────────────┐
│ BROWSER / SPA │
│ React 19 + Vite │
│ AuthProvider → AuthScreen → Dashboard │
│ ResourceForm → ResourceList → LessonGeneratorModal │
└──────────────────────┬──────────────────────────────────────────┘
│ HTTPS (Axios)
┌──────────────────────▼──────────────────────────────────────────┐
│ FASTAPI (Python 3.11) │
│ /api/resources (CRUD + Paginação) │
│ /api/smart-assist (IA — Gemini → Fallback OpenAI) │
│ /api/docentes (Sincronização Firebase → SQLite) │
│ /gerar_aula (Motor de Aula Personalizada) │
│ /health (DevOps Health Check) │
│ │
│ Middleware: CORS │ Logs Estruturados │ Pydantic │
└──────┬───────────────────────────┬─────────────────────────────-┘
│ │
┌──────▼───────┐ ┌──────────▼──────────────────────────────┐
│ SQLite DB │ │ AI Manager │
│ (SQLAlchemy)│ │ call_gemini() → Fallback call_openai()│
│ recursos │ │ Prompt Engineering (pt-BR, JSON estrito)│
│ docentes │ └─────────────────────────────────────────┘
└──────────────┘
```

### 2.2 Fluxo Completo — Smart Assist (IA)

```
1. Usuário preenche o Título e seleciona o Tipo no formulário.
2. Clica em [Gerar com IA] → Frontend dispara POST /api/smart-assist
{ titulo: 'Matemática Financeira', tipo: 'Vídeo' }

3. FastAPI valida o payload com Pydantic (SmartAssistRequest).
4. @log_ai_request captura o timestamp de início.
5. AI Manager → build_smart_assist_prompt(titulo, tipo)
Prompt instrui a IA a responder como Assistente Pedagógico,
em pt-BR, retornando JSON estrito: { descricao, tags }

6. call_gemini(prompt) → google-genai SDK → gemini-2.5-flash
Se falhar → call_openai(prompt) → gpt-4o-mini (fallback)
Se ambos falharem → HTTP 503 ao cliente.

7. @log_ai_request registra:
[INFO] AI Request: Title="...", Provider="Gemini",
Fallback=False, TokenUsage=150, Latency=0.87s

8. FastAPI serializa AIResult (dataclass) → SmartAssistResponse (Pydantic)
{ descricao: '...', tags: ['tag1', 'tag2', 'tag3'] }

9. Frontend preenche os campos 'Descrição' e 'Tags' automaticamente.
Timer visual ⏱️ mostra o tempo de resposta da IA em tempo real.
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

### 2.4 Soft Delete com Undo (Optimistic UI)

```
1. Usuário clica em [Excluir] em um ResourceCard.
2. Frontend remove o item do estado React imediatamente (Optimistic UI).
3. Toast aparece no canto inferior direito com countdown: '(5s)'
4. setInterval decrementa 1s/s visualmente.
5. setTimeout de 5000ms dispara DELETE /api/resources/{id} no backend.
6. Se usuário clicar em [Desfazer]:
→ clearTimeout (cancela o DELETE real)
→ clearInterval (para o contador)
→ Adiciona item de volta ao estado React
7. Item restaurado instantaneamente, sem requisição de re-fetch.
```

-----

## 3. Estrutura do Repositório

```
vlab-desafio-hub-fullstack/
├── .github/
│ └── workflows/
│ ├── ci.yml # Lint + Testes a cada push/PR
│ └── deploy.yml # Deploy SSH automático → Oracle Cloud
│
├── backend/ # Aplicação Python / FastAPI
│ ├── ai/
│ │ ├── gemini_provider.py # Integração Google Gemini 2.5 Flash
│ │ ├── openai_provider.py # Fallback GPT-4o-mini
│ │ ├── manager.py # Padrão Strategy + Fallback Automático
│ │ └── prompts.py # Engenharia de Prompt (pt-BR, JSON)
│ ├── database.py # SQLAlchemy engine + modelos ORM
│ ├── main.py # Rotas FastAPI + Middleware + Decorators
│ └── schemas.py # Pydantic schemas + Enums
│
├── frontend/ # SPA React 19 + Vite
│ └── src/
│ ├── features/
│ │ ├── auth/ # AuthProvider (Context) + AuthScreen
│ │ ├── lessonGenerator/# Modal de Geração de Aula com IA
│ │ └── resources/ # Dashboard, ResourceForm, ResourceList
│ ├── services/
│ │ ├── api.js # Camada de serviço Axios (base URL env)
│ │ └── firebase.js # Inicialização Firebase Auth
│ └── utils/
│ └── logger.js # Logger colorido no console do navegador
│
├── tests/
│ └── test_api.py # 5 testes pytest (health, CRUD, paginação, IA)
│
├── requirements.txt # Dependências Python
└── README.md
```

-----

## 4. Como Executar Localmente

### 4.1 Pré-requisitos

|Ferramenta |Versão recomendada |
|----------------|------------------------------------|
|Python |3.11+ |
|Node.js |18+ (LTS) |
|npm |9+ |
|Git |Qualquer versão recente |
|Conta Firebase |Gratuita (Authentication habilitado)|
|Chave Gemini API|Gratuita — aistudio.google.com |
|Chave OpenAI API|Opcional (apenas para fallback) |

### 4.2 Passo 1 — Clonar o repositório

```bash
git clone https://github.com/willianrupert/vlab-desafio-hub-fullstack.git
cd vlab-desafio-hub-fullstack
```

### 4.3 Passo 2 — Configurar e iniciar o Backend

```bash
# 1. Criar e ativar ambiente virtual
python -m venv .venv

source .venv/bin/activate # Linux / macOS
.venv\Scripts\activate # Windows (PowerShell)

# 2. Instalar dependências
pip install -r requirements.txt

# 3. Criar arquivo de variáveis de ambiente
cp .env.example .env

# 4. Editar .env com suas chaves
# GEMINI_API_KEY=sua_chave_aqui
# OPENAI_API_KEY=sua_chave_aqui (opcional)

# 5. Iniciar o servidor FastAPI
python -m uvicorn backend.main:app --reload
```

> **Nota:** O banco de dados SQLite (`vlab_hub.db`) é criado automaticamente na primeira execução via `Base.metadata.create_all()`. Não é necessário rodar migrations manualmente.

A API estará disponível em:

- **API:** `http://127.0.0.1:8000`
- **Swagger UI:** `http://127.0.0.1:8000/docs`
- **Health Check:** `http://127.0.0.1:8000/health`

### 4.4 Passo 3 — Configurar e iniciar o Frontend

Abra um **segundo terminal** e navegue para a pasta `frontend`:

```bash
cd frontend

# 1. Instalar dependências
npm install

# 2. Criar arquivo de variáveis de ambiente
cp .env.example .env

# 3. Editar .env com as credenciais do Firebase
# VITE_API_URL=http://localhost:8000/api
# VITE_FIREBASE_API_KEY=xxx
# VITE_FIREBASE_AUTH_DOMAIN=xxx.firebaseapp.com
# ... (ver seção 12)

# 4. Iniciar o servidor de desenvolvimento
npm run dev
```

Acesse a aplicação em `http://localhost:5173`.

> **Sem Firebase?** Use o botão **“Acesso Rápido do Avaliador”** na tela de login para entrar em modo demo sem credenciais reais.

### 4.5 Passo 4 — Executar os Testes

```bash
# Com o ambiente virtual ativado, na raiz do projeto:
pytest tests/ -v

# Saída esperada:
# tests/test_api.py::test_health_check_retorna_200 PASSED
# tests/test_api.py::test_criar_recurso_valido PASSED
# tests/test_api.py::test_listagem_com_paginacao PASSED
# tests/test_api.py::test_smart_assist_valido PASSED
# tests/test_api.py::test_sincronizar_docente_novo PASSED
# 5 passed in 0.XXs
```

-----

## 5. Referência da API

|Método |Rota |Descrição |
|--------|---------------------|----------------------------------------------|
|`GET` |`/health` |Health check. Retorna `{ status: "ok" }` |
|`POST` |`/api/resources` |Cria um novo recurso educacional |
|`GET` |`/api/resources` |Lista recursos com paginação (`skip`, `limit`)|
|`PUT` |`/api/resources/{id}`|Atualiza recurso existente pelo ID |
|`DELETE`|`/api/resources/{id}`|Remove recurso pelo ID (HTTP 204) |
|`POST` |`/api/smart-assist` |Gera descrição e tags via IA |
|`POST` |`/api/docentes` |Sincroniza usuário Firebase com o banco local |
|`POST` |`/gerar_aula` |Gera plano de aula personalizado via LLM |

### Exemplo — Criar Recurso

```json
// POST /api/resources
{
"titulo": "Introdução ao React",
"descricao": "Guia completo para iniciantes em desenvolvimento frontend.",
"tipo": "Vídeo",
"link_url": "https://youtube.com/watch?v=abc123",
"tags": ["react", "frontend", "javascript"]
}

// Resposta 201 Created:
{
"id": 1,
"titulo": "Introdução ao React",
"descricao": "Guia completo para iniciantes em desenvolvimento frontend.",
"tipo": "Vídeo",
"link_url": "https://youtube.com/watch?v=abc123",
"tags": ["react", "frontend", "javascript"]
}
```

### Exemplo — Smart Assist (IA)

```json
// POST /api/smart-assist
{
"titulo": "Matemática Financeira",
"tipo": "Vídeo"
}

// Resposta 200 OK:
{
"descricao": "Este vídeo apresenta os fundamentos da matemática financeira, abordando juros simples, compostos e cálculo de prestações de forma prática.",
"tags": ["finanças", "matemática", "juros"]
}
```

Log gerado automaticamente no servidor:

```
[INFO] AI Request: Title="Matemática Financeira", Provider="Gemini", Fallback=False, TokenUsage=150, Latency=0.87s
```

-----

## 6. Modelo de Banco de Dados

### Tabela: `recursos`

|Coluna |Tipo |Descrição |
|-----------|-------|-----------------------------------------|
|`id` |INTEGER|Chave primária, autoincrement |
|`titulo` |STRING |Título do material didático (indexado) |
|`descricao`|STRING |Descrição gerada pela IA ou manual |
|`tipo` |STRING |Enum: `'Vídeo'`, `'PDF'`, `'Link'` |
|`link_url` |STRING |URL validada pelo Pydantic (`HttpUrl`) |
|`tags` |JSON |Lista de strings em JSON nativo do SQLite|

### Tabela: `docentes`

|Coluna |Tipo |Descrição |
|--------------|-------|------------------------------|
|`id` |INTEGER|Chave primária, autoincrement |
|`nome` |STRING |Nome completo do docente |
|`email` |STRING |E-mail único (índice único) |
|`firebase_uid`|STRING |UID do Firebase (índice único)|

### Inicialização Automática

```python
# backend/main.py — executado na inicialização do servidor
database.Base.metadata.create_all(bind=database.engine)
# Cria o arquivo vlab_hub.db na raiz do projeto automaticamente.
```

-----

## 7. Integração com Inteligência Artificial

### 7.1 Arquitetura Modular (Padrão Strategy)

|Módulo |Responsabilidade |
|--------------------|-----------------------------------------------------------------------------|
|`manager.py` |Orquestra a chamada: Gemini → Fallback OpenAI. Retorna `AIResult` (dataclass)|
|`gemini_provider.py`|Chama google-genai SDK com `gemini-2.5-flash`, força resposta JSON |
|`openai_provider.py`|Chama OpenAI SDK com `gpt-4o-mini`, usa `response_format: json_object` |
|`prompts.py` |Engenharia de Prompt: Persona Pedagógica, regras pt-BR, JSON estrito |

### 7.2 Prompt Engineering

```
Act as an Expert Pedagogical Assistant and Instructional Designer.
Your task is to analyze the title and type of an educational resource
and generate a concise, engaging description and relevant tags.

# INPUT DATA
- Title: "{title}"
- Material Type: "{resource_type}"

# GUIDELINES
1. Description: Write a clear, useful description (maximum 2 sentences)
that helps students understand the value of this resource.
2. Tags: Provide exactly 3 highly relevant, distinct keywords (tags).
3. Language: The generated content MUST be in Portuguese (pt-BR).

# OUTPUT FORMAT (Strict JSON)
You must respond ONLY with a valid JSON object:
{
"descricao": "A descrição gerada aqui.",
"tags": ["tag1", "tag2", "tag3"]
}
```

**Técnicas aplicadas:**

- **Persona Prompting:** `Act as an Expert Pedagogical Assistant`
- **Output Constraining:** força JSON estrito para parsing confiável
- **Language Lock:** garante resposta sempre em pt-BR
- **Format Specification:** schema JSON explícito no prompt
- **Quantity Constraint:** `exactly 3 tags`, `maximum 2 sentences`

### 7.3 Fallback Automático

```python
# backend/ai/manager.py
def generate_resource_metadata(title, resource_type):
prompt = build_smart_assist_prompt(title, resource_type)
try:
data = call_gemini(prompt) # Prioridade: Gemini
return AIResult(..., provider="Gemini", fallback_used=False)
except Exception as e:
logger.warning(f"[WARN] Gemini falhou ({e}). Fallback para OpenAI...")
try:
data = call_openai(prompt) # Fallback: OpenAI
return AIResult(..., provider="OpenAI", fallback_used=True)
except Exception as fallback_error:
raise RuntimeError("Serviços de IA temporariamente indisponíveis.")
```

-----

## 8. Recursos Modernos da Linguagem

### 8.1 Python

#### Dataclass (`AIResult`)

Padroniza o tráfego de dados internos entre o Manager de IA e as rotas FastAPI, com tipagem estrita e valores padrão:

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

Envolve a rota de IA para capturar métricas de latência, provedor e tokens, gerando logs no padrão exigido pelo edital:

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

@app.post("/api/smart-assist")
@log_ai_request
def smart_assist(request: schemas.SmartAssistRequest):
...
```

#### Pydantic v2 — Validação Rigorosa

```python
class TipoRecurso(str, Enum):
video = "Vídeo"
pdf = "PDF"
link = "Link"

class RecursoCreate(BaseModel):
titulo: str = Field(..., min_length=3)
descricao: str = Field(...)
tipo: TipoRecurso
link_url: HttpUrl = Field(...) # Valida URL real
tags: List[str] = Field(default_factory=list)
```

### 8.2 JavaScript / React

#### Context API (`AuthProvider`)

Centraliza o estado de autenticação expondo hooks customizados (`useAuth`) sem prop drilling:

```jsx
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
const [user, setUser] = useState(null);
// login, register, loginGoogle, loginAvaliador, logout ...
return (
<AuthContext.Provider value={{ user, loading, login, ... }}>
{children}
</AuthContext.Provider>
);
}
```

#### `useCallback` + `useEffect` para Busca Otimizada

```jsx
const fetchResources = useCallback(async () => {
setLoading(true);
const data = await api.getResources({ skip: page * LIMIT, limit: LIMIT });
setItems(data.items || []);
setTotalItems(data.total || 0);
setLoading(false);
}, [page]); // Recria apenas quando 'page' muda

useEffect(() => { fetchResources(); }, [fetchResources]);
```

#### Logger Colorido no Console

```js
export const logger = {
info: (m, d) => console.log(`%c[INFO] ${m}`, "color:#3b82f6;font-weight:bold", d),
warn: (m, d) => console.warn(`%c[WARN] ${m}`, "color:#f59e0b;font-weight:bold", d),
error: (m, d) => console.error(`%c[ERROR] ${m}`, "color:#ef4444;font-weight:bold", d),
success: (m, d) => console.log(`%c[OK] ${m}`, "color:#10b981;font-weight:bold", d),
};
```

-----

## 9. DevOps & CI/CD

### 9.1 Pipeline de Integração Contínua (`ci.yml`)

Executado automaticamente a cada Push ou Pull Request nas branches `main`/`master`:

```
1. Checkout do código
2. Setup Python 3.11
3. pip install -r requirements.txt
4. flake8 — Análise de Sintaxe (E9, F63, F7, F82 → falha o build)
5. flake8 — Análise de Qualidade (max-line-length=127 → warning)
6. pytest tests/ — Roda os 5 testes automatizados
(env: GEMINI_API_KEY=dummy_key — não precisa de chave real)
```

### 9.2 Pipeline de Deploy (`deploy.yml`)

A cada push na branch `main`, deploy automático via SSH para a VM Oracle Cloud:

```
1. SSH na VM Oracle Cloud (host/username/key via GitHub Secrets)
2. git pull origin main
3. source .venv/bin/activate
4. pip install -r requirements.txt
5. sudo systemctl restart hub-backend

Secrets necessários:
HOST → IP da VM Oracle Cloud
USERNAME → Usuário SSH (ex: ubuntu)
SSH_PRIVATE_KEY → Chave privada RSA/ED25519
```

### 9.3 Observabilidade

|Métrica |Implementação |
|------------------|-------------------------------------------------------------|
|Latência da IA |Medida pelo decorator `@log_ai_request` via `time.time()` |
|Provedor utilizado|Campo `provider` na `AIResult` (`Gemini` ou `OpenAI`) |
|Uso de fallback |Campo `fallback_used` boolean na `AIResult` |
|Tokens estimados |Campo `token_usage` na `AIResult` |
|Health Check |`GET /health` → `{ status: "ok", message: "API is running" }`|
|Logs de erro |`logger.error()` em todos os `catch` blocks críticos |

-----

## 10. Acessibilidade

O projeto implementa as diretrizes de acessibilidade do Governo Federal Brasileiro:

|Recurso |Implementação |
|-----------------------|-------------------------------------------------------------------------------------|
|VLibras (LIBRAS) |Widget oficial `vlibras.gov.br` integrado ao `index.html` |
|Alto Contraste |Classe CSS `alto-contraste` aplicada via JS no `<body>` |
|Ajuste de Fonte |`document.body.style.zoom` controlado pelos botões A- / A / A+ |
|Skip Links |Links “Ir para menu/conteúdo/rodapé” usando âncoras `#menu` / `#conteudo` / `#rodape`|
|Barra de Acessibilidade|Componente Gov.br padrão no topo de todas as páginas |
|Idioma |Indicador “Português | BR” visível na barra de acessibilidade |
|Tags semânticas |`<header>`, `<main>`, `<footer>` com IDs para navegação por âncora |

-----

## 11. Testes Automatizados

|Teste |O que valida |
|-------------------------------|--------------------------------------------------------------------|
|`test_health_check_retorna_200`|Endpoint `/health` retorna 200 e payload correto |
|`test_criar_recurso_valido` |`POST /api/resources` com campos obrigatórios retorna 201 com ID |
|`test_listagem_com_paginacao` |`GET /api/resources` retorna dict com `total` e `items` (max 5) |
|`test_smart_assist_valido` |`POST /api/smart-assist` com mock da IA retorna `descricao` e `tags`|
|`test_sincronizar_docente_novo`|`POST /api/docentes` salva novo docente e retorna 201 com ID |

### Estratégia de Mock

O teste `test_smart_assist_valido` usa `unittest.mock.patch` para substituir a chamada real à API de IA por um `AIResult` controlado, garantindo que o CI/CD funcione sem chaves reais:

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

-----

## 12. Variáveis de Ambiente

### Backend (`.env` — raiz do projeto)

```env
GEMINI_API_KEY=sua_chave_gemini_aqui
OPENAI_API_KEY=sua_chave_openai_aqui # Opcional (usado apenas no fallback)
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

> ⚠️ **Segurança:** Nunca faça commit dos arquivos `.env`. Ambos estão listados no `.gitignore`. Use GitHub Secrets para ambientes de produção.

-----

## 13. Checklist de Requisitos do Edital

|Requisito |Status |
|------------------------------------------|----------------------------------------------------------------|
|CRUD — Listagem com paginação |✅ `GET /api/resources?skip=N&limit=N` retorna `{ total, items }`|
|CRUD — Cadastro |✅ `POST /api/resources` com validação Pydantic |
|CRUD — Edição |✅ `PUT /api/resources/{id}` |
|CRUD — Exclusão |✅ `DELETE /api/resources/{id}` + Soft Delete com Undo |
|Campos: Título, Descrição, Tipo, URL, Tags|✅ Todos implementados e validados |
|Tipo restrito a: Vídeo, PDF, Link |✅ Enum `TipoRecurso` no Pydantic |
|Botão “Gerar Descrição com IA” |✅ Botão com spinner e cronômetro visual |
|Frontend envia Título + Tipo ao backend |✅ `POST /api/smart-assist { titulo, tipo }` |
|Backend consulta API de LLM |✅ Gemini 2.5 Flash + fallback GPT-4o-mini |
|Retorna descrição + 3 tags |✅ `{ descricao, tags: [3 itens] }` |
|Frontend preenche campos automaticamente |✅ `set('descricao', ...)` + `set('tags', ...)` |
|FastAPI + Pydantic |✅ FastAPI 0.135.1 + Pydantic v2.12.5 |
|Banco de dados SQLite |✅ SQLite + SQLAlchemy 2.0.47 |
|Variáveis de ambiente para chaves de API |✅ `python-dotenv` + `.env` no `.gitignore` |
|Prompt de Sistema eficiente |✅ Persona + JSON estrito + pt-BR + restrições de formato |
|SPA (Single Page Application) |✅ React 19 + Vite |
|Loading state enquanto IA processa |✅ `aiLoading` + ícone `Loader2` + cronômetro |
|Tratamento de erro se IA falhar |✅ `try/catch` + mensagem visual + HTTP 503 |
|CI com linting a cada push |✅ GitHub Actions flake8 (E9/F63/F7/F82) |
|Logs estruturados com TokenUsage e Latency|✅ Decorator `@log_ai_request` |
|Endpoint `/health` |✅ `GET /health` → `{ status: "ok" }` |
|README.md detalhado |✅ Este documento |
|API Key não hardcoded |✅ `load_dotenv()` + `os.getenv()` em todos os providers |

-----

## 14. Stack Tecnológica Completa

### Backend

|Tecnologia |Versão |Uso |
|-------------|-------|-------------------------|
|Python |3.11+ |Linguagem principal |
|FastAPI |0.135.1|Framework web assíncrono |
|Pydantic |v2.12.5|Validação e serialização |
|SQLAlchemy |2.0.47 |ORM para SQLite |
|SQLite |Nativo |Banco de dados relacional|
|google-genai |1.65.0 |SDK Google Gemini |
|openai |2.24.0 |SDK OpenAI GPT |
|python-dotenv|1.2.2 |Variáveis de ambiente |
|uvicorn |0.41.0 |Servidor ASGI |
|pytest |9.0.2 |Testes automatizados |
|httpx |0.28.1 |Cliente HTTP para testes |

### Frontend

|Tecnologia |Versão |Uso |
|----------------|-------|-----------------------------|
|React |19.2.0 |Biblioteca de UI |
|Vite |7.3.1 |Build tool e dev server |
|Firebase |12.10.0|Autenticação (Email + Google)|
|Axios |1.13.6 |Cliente HTTP |
|Lucide React |0.576.0|Ícones SVG |
|React Router DOM|7.13.1 |Roteamento SPA |
|ESLint |9.39.1 |Linting JavaScript |

### DevOps & Infraestrutura

|Tecnologia |Uso |
|-------------------|-----------------------------------------|
|GitHub Actions |CI/CD — Lint + Testes + Deploy automático|
|Oracle Cloud VM |Hospedagem do backend em produção |
|systemd |Gerenciamento do serviço `hub-backend` |
|flake8 |Análise estática de código Python |
|appleboy/ssh-action|Deploy remoto via SSH no GitHub Actions |

-----

*© 2025 V-LAB Hub — Desenvolvido para o Desafio Técnico Fullstack V-LAB.*