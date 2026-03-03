from sqlalchemy import create_engine, Column, Integer, String, JSON
from sqlalchemy.orm import declarative_base, sessionmaker

# Cria um arquivo local chamado vlab_hub.db
SQLALCHEMY_DATABASE_URL = "sqlite:///./vlab_hub.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class RecursoDB(Base):
    __tablename__ = "recursos"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String, index=True)
    descricao = Column(String)
    tipo = Column(String)
    link_url = Column(String)
    tags = Column(JSON) # O SQLite nativo aceita JSON para listas!

class DocenteDB(Base):
    __tablename__ = "docentes"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String)
    email = Column(String, unique=True, index=True)
    firebase_uid = Column(String, unique=True, index=True)