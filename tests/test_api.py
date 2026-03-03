from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_health_check_retorna_200():
    """Garante que o endpoint de observabilidade exigido pelo edital está vivo."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "message": "API is running"}

def test_criar_recurso_valido():
    """Testa a criação de um recurso garantindo os campos obrigatórios e Pydantic."""
    payload = {
        "titulo": "Introdução ao React",
        "descricao": "Um guia completo para iniciantes.",
        "tipo": "Vídeo",
        "link_url": "https://youtube.com/watch?v=123",
        "tags": ["frontend", "react", "javascript"]
    }
    
    response = client.post("/api/resources", json=payload)
    
    assert response.status_code == 201
    data = response.json()
    assert data["titulo"] == payload["titulo"]
    assert "id" in data

def test_listagem_com_paginacao():
    """Testa se a listagem de recursos respeita o novo formato de paginação com total."""
    response = client.get("/api/resources?skip=0&limit=5")
    assert response.status_code == 200
    
    data = response.json()
    
    # Agora a resposta é um dicionário contendo 'total' e 'items'
    assert isinstance(data, dict)
    assert "total" in data
    assert "items" in data
    
    # A lista de itens não deve ultrapassar o limite de 5
    assert isinstance(data["items"], list)
    assert len(data["items"]) <= 5

def test_smart_assist_valido():
    """Testa a rota da IA garantindo que devolve a descrição e exatamente 3 tags."""
    payload = {
        "titulo": "Matemática Financeira",
        "tipo": "Vídeo"
    }
    # Este teste vai bater na API real do Gemini, pode demorar 1-2 segundos
    response = client.post("/api/smart-assist", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    assert "descricao" in data
    assert "tags" in data
    assert isinstance(data["tags"], list)
    assert len(data["tags"]) == 3

def test_sincronizar_docente_novo():
    """Testa se o backend consegue salvar um novo docente que veio do Firebase."""
    payload = {
        "nome": "Professor Avaliador",
        "email": "avaliador@vlab.edu.br",
        "firebase_uid": "uid_falso_12345"
    }
    
    response = client.post("/api/docentes", json=payload)
    
    assert response.status_code == 201
    data = response.json()
    assert data["nome"] == payload["nome"]
    assert data["email"] == payload["email"]
    assert "id" in data # Garante que foi salvo no banco e ganhou um ID