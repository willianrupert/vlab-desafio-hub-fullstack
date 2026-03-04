import time
import logging
from functools import wraps
from fastapi import FastAPI, Depends, status, HTTPException
from sqlalchemy.orm import Session
from typing import List
from fastapi.middleware.cors import CORSMiddleware

from backend import schemas, database
from backend.ai.manager import generate_resource_metadata, AIResult

# Configuração de Observabilidade (Logs Estruturados)
logging.basicConfig(level=logging.INFO, format="%(message)s")
logger = logging.getLogger(__name__)

# Garante que as tabelas sejam criadas no SQLite ao iniciar
database.Base.metadata.create_all(bind=database.engine)

app = FastAPI(
    title="Hub Inteligente de Recursos Educacionais",
    description="API Fullstack para gestão de materiais didáticos com IA."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Decorator para Logs
def log_ai_request(func):
    """
    Decorator que mede latência e extrai metadados da Dataclass AIResult 
    para padronizar os logs exigidos no edital.
    """
    @wraps(func)
    def wrapper(request: schemas.SmartAssistRequest, *args, **kwargs):
        start_time = time.time()
        
        # Executa a rota (que vai chamar a IA e devolver a Dataclass AIResult)
        resultado: AIResult = func(request, *args, **kwargs)
        
        latency = time.time() - start_time
        
        # O edital pede: [INFO] AI Request: Title="...", TokenUsage=150, Latency=1.2s.
        # Adicionamos Provider e Fallback
        logger.info(
            f'[INFO] AI Request: Title="{request.titulo}", Provider="{resultado.provider}", '
            f'Fallback={resultado.fallback_used}, TokenUsage={resultado.token_usage}, Latency={latency:.2f}s'
        )
        
        return resultado
    return wrapper

@app.get("/health")
def health_check():
    """Endpoint bónus de DevOps exigido pelo edital."""
    return {"status": "ok", "message": "API is running"}

@app.post("/api/resources", response_model=schemas.RecursoResponse, status_code=status.HTTP_201_CREATED)
def create_resource(recurso: schemas.RecursoCreate, db: Session = Depends(get_db)):
    """Cria um novo material no banco de dados."""
    db_recurso = database.RecursoDB(
        titulo=recurso.titulo,
        descricao=recurso.descricao,
        tipo=recurso.tipo.value,
        link_url=str(recurso.link_url),
        tags=recurso.tags
    )
    db.add(db_recurso)
    db.commit()
    db.refresh(db_recurso)
    return db_recurso

@app.get("/api/resources", response_model=schemas.PaginatedRecursos)
def list_resources(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    """Lista os materiais respeitando a paginação pedida no edital."""
    total_items = db.query(database.RecursoDB).count()
    recursos = db.query(database.RecursoDB).offset(skip).limit(limit).all()
    
    return {
        "total": total_items,
        "items": recursos
    }

@app.delete("/api/resources/{resource_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_resource(resource_id: int, db: Session = Depends(get_db)):
    """Deleta um material pelo ID."""
    db_recurso = db.query(database.RecursoDB).filter(database.RecursoDB.id == resource_id).first()
    if not db_recurso:
        raise HTTPException(status_code=404, detail="Recurso não encontrado.")
    db.delete(db_recurso)
    db.commit()
    return None

@app.put("/api/resources/{resource_id}", response_model=schemas.RecursoResponse)
def update_resource(resource_id: int, recurso: schemas.RecursoCreate, db: Session = Depends(get_db)):
    """Edita um material existente."""
    db_recurso = db.query(database.RecursoDB).filter(database.RecursoDB.id == resource_id).first()
    if not db_recurso:
        raise HTTPException(status_code=404, detail="Recurso não encontrado.")
    
    # Atualiza os dados
    db_recurso.titulo = recurso.titulo
    db_recurso.descricao = recurso.descricao
    db_recurso.tipo = recurso.tipo.value
    db_recurso.link_url = str(recurso.link_url)
    db_recurso.tags = recurso.tags
    
    db.commit()
    db.refresh(db_recurso)
    return db_recurso

@app.post("/api/docentes", response_model=schemas.DocenteResponse, status_code=status.HTTP_201_CREATED)
def sync_docente(docente: schemas.DocenteCreate, db: Session = Depends(get_db)):
    """Sincroniza o usuário logado no Firebase com o banco de dados local."""
    # Verifica se o professor já existe no banco
    db_docente = db.query(database.DocenteDB).filter(database.DocenteDB.email == docente.email).first()
    if db_docente:
        return db_docente # Se já existir, só devolve os dados
    
    # Se for novo (primeiro acesso via Google ou Registro), salva no banco
    new_docente = database.DocenteDB(
        nome=docente.nome,
        email=docente.email,
        firebase_uid=docente.firebase_uid
    )
    db.add(new_docente)
    db.commit()
    db.refresh(new_docente)
    return new_docente

@app.post("/api/smart-assist", response_model=schemas.SmartAssistResponse)
@log_ai_request
def smart_assist(request: schemas.SmartAssistRequest):
    """
    Integração modularizada com LLMs (Gemini c/ Fallback ChatGPT) 
    para gerar descrições e tags. Agora realiza Scraping da URL para contexto rico!
    """
    try:
        # Passamos a URL extraída do request para o manager
        return generate_resource_metadata(request.titulo, request.tipo.value, request.url)
    
    except Exception as e:
        logger.error(f"[ERROR] Smart Assist Crítico: {e}")
        raise HTTPException(status_code=503, detail="Serviços de IA temporariamente indisponíveis.")