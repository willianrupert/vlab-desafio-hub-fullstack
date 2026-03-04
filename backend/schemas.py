from pydantic import BaseModel, Field, HttpUrl, ConfigDict
from typing import List, Optional
from enum import Enum

# Restringe os tipos exatos pedidos no edital
class TipoRecurso(str, Enum):
    video = "Vídeo"
    pdf = "PDF"
    link = "Link"

class RecursoBase(BaseModel):
    titulo: str = Field(..., min_length=3, description="Título do material didático")
    descricao: str = Field(..., description="Descrição gerada pela IA ou manual")
    tipo: TipoRecurso
    link_url: HttpUrl = Field(..., description="URL válida do material")
    tags: List[str] = Field(default_factory=list)

class RecursoCreate(RecursoBase):
    pass

class RecursoResponse(RecursoBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

# Novos Schemas para o Smart Assist
class SmartAssistRequest(BaseModel):
    titulo: str = Field(..., min_length=3, description="O título inserido pelo utilizador")
    tipo: TipoRecurso = Field(..., description="O tipo do material")
    url: Optional[str] = Field(None, description="A URL do material para scraping") # <-- NOVO

class SmartAssistResponse(BaseModel):
    descricao: str = Field(..., description="A descrição gerada pela IA")
    tags: List[str] = Field(..., description="Exatamente 3 tags sugeridas")

class PaginatedRecursos(BaseModel):
    total: int
    items: List[RecursoResponse]

class DocenteBase(BaseModel):
    nome: str
    email: str
    firebase_uid: str

class DocenteCreate(DocenteBase):
    pass

class DocenteResponse(DocenteBase):
    id: int
    model_config = ConfigDict(from_attributes=True)