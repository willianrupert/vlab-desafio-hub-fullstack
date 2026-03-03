# 🎓 V-LAB Hub Educacional

Uma plataforma Fullstack desenvolvida para a gestão inteligente de materiais didáticos. Este sistema utiliza Inteligência Artificial (LLMs) para atuar como um Assistente Pedagógico, automatizando a criação de descrições e a categorização (tags) de recursos educacionais.

![Status](https://img.shields.io/badge/Status-Concluído-success)
![React](https://img.shields.io/badge/Frontend-React_&_Vite-blue)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688)
![Firebase](https://img.shields.io/badge/Auth-Firebase-FFCA28)

## ✨ Funcionalidades e Diferenciais Implementados

Além dos requisitos básicos do edital, este projeto inclui implementações de nível sênior:

- **Autenticação Real (Firebase):** Login via E-mail/Password e OAuth2 com Google. Sincronização automática de usuários com o banco de dados local.
- **Smart Assist (IA Modular):** Arquitetura Clean com Padrão Strategy. O motor utiliza a API do **Google Gemini** por padrão e possui um sistema de **Fallback automático para OpenAI (ChatGPT)** caso o serviço principal falhe.
- **Acessibilidade Governamental:** Inclusão do widget **VLibras** nativo, controle de Alto Contraste e ajuste dinâmico de tamanho de fonte (Zoom), seguindo normas rigorosas de acessibilidade.
- **Optimistic UI (Soft Delete):** A exclusão de recursos apresenta um "Countdown" dinâmico na interface, permitindo ao usuário desfazer a ação (reverter) antes da eliminação definitiva no banco de dados.
- **Observabilidade:** Uso de decorators avançados no Python (`@log_ai_request`) para estruturação de logs precisos, incluindo latência, uso de tokens e provedor utilizado.
- **Testes (TDD) e CI:** Cobertura de testes com `pytest` integrados a um pipeline de CI no GitHub Actions com linting automátizado (`flake8`).

## 🛠️ Tecnologias Utilizadas

**Frontend:**
- React 18 + Vite (SPA pura)
- Lucide React (Ícones)
- Axios (Comunicações HTTP)
- Firebase Auth (Autenticação)

**Backend:**
- Python 3.11+
- FastAPI (Alta performance)
- SQLite + SQLAlchemy (ORM)
- Pydantic (Validação rigorosa de dados e Dataclasses)
- Google GenAI SDK & OpenAI SDK

## 🚀 Como Executar o Projeto Localmente

### 1. Clonar o Repositório
```bash
git clone [https://github.com/SEU_USUARIO/vlab-desafio-hub-fullstack.git](https://github.com/willianrupert/vlab-desafio-hub-fullstack.git)
cd vlab-desafio-hub-fullstack
```

### 2. Configurar o Backend (Python)
Abra um terminal na raiz do projeto:
```bash
# Criar ambiente virtual
python -m venv .venv

# Ativar o ambiente (Linux/Mac)
source .venv/bin/activate
# Ativar o ambiente (Windows)
# .venv\Scripts\activate

# Instalar dependências
pip install -r requirements.txt

# Configurar as variáveis de ambiente
cp .env.example .env
# Adicione as suas chaves GEMINI_API_KEY e OPENAI_API_KEY no arquivo .env

# Executar o servidor FastAPI
uvicorn backend.main:app --reload
```
A API estará disponível em `http://127.0.0.1:8000`. Você pode consultar a documentação interativa acessando `/docs`.

### 3. Configurar o Frontend (React)
Abra um **segundo terminal** e navegue para a pasta `frontend`:
```bash
cd frontend

# Instalar dependências do Node
npm install

# Configurar as variáveis de ambiente do Firebase
cp .env.example .env
# Adicione as chaves VITE_FIREBASE_* no arquivo .env

# Iniciar o servidor de desenvolvimento
npm run dev
```
Acesse a aplicação através de `http://localhost:5173/`.

## 🧪 Testes Automatizados
Para rodar a suíte de testes no backend:
```bash
# Com o ambiente virtual ativado na raiz do projeto
pytest tests/
```

---
*Projeto desenvolvido para desafio técnico.*
