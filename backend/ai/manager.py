import logging
import re
import requests
from bs4 import BeautifulSoup
from youtube_transcript_api import YouTubeTranscriptApi
from dataclasses import dataclass, field
from backend.ai.prompts import build_smart_assist_prompt
from backend.ai.gemini_provider import call_gemini
from backend.ai.openai_provider import call_openai

logger = logging.getLogger(__name__)

# Dataclass para padronizar o tráfego interno de dados
@dataclass
class AIResult:
    descricao: str
    tags: list[str]
    provider: str
    fallback_used: bool
    token_usage: int = field(default=150) # Simulado para o log, já que APIs variam a devolução

def extract_youtube_transcript(url: str) -> str:
    """Extrai a transcrição de um vídeo do YouTube usando a API moderna (v1.2+)."""
    try:
        video_id_match = re.search(r'(?:v=|\/)([0-9A-Za-z_-]{11})', url)
        if not video_id_match:
            logger.warning(f"ID do vídeo não encontrado na URL: {url}")
            return ""
            
        video_id = video_id_match.group(1)
        ytt_api = YouTubeTranscriptApi()
        idiomas_prioridade = ['pt-BR', 'pt', 'en', 'es']
        
        try:
            transcript = ytt_api.fetch(video_id, languages=idiomas_prioridade)
        except Exception:
            transcript_list = ytt_api.list(video_id)
            primeira_legenda = list(transcript_list)[0]
            transcript = primeira_legenda.fetch()
            
        # Dicionários E Objetos
        partes_texto = []
        for t in transcript:
            if isinstance(t, dict):
                partes_texto.append(t.get('text', '')) # Para versões antigas
            else:
                partes_texto.append(getattr(t, 'text', '')) # Para a versão nova
                
        texto = " ".join(partes_texto)
        
        logger.info(f"Legenda extraída com sucesso! ({len(texto)} caracteres)")
        return texto[:15000] # Limite para não explodir tokens
        
    except Exception as e:
        logger.error(f"Erro Crítico no Scraping do YouTube ({url}): {e}")
        return ""

def extract_webpage_text(url: str) -> str:
    """Extrai texto de uma página web comum disfarçando a requisição."""
    try:
        # Headers mais robustos para simular um navegador real (evita bloqueios 403)
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
        }
        
        response = requests.get(url, headers=headers, timeout=10) # Aumentei o timeout para 10s
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Remove scripts, estilos e menus de navegação inúteis
        for tag in soup(["script", "style", "nav", "footer", "header"]):
            tag.extract()
            
        texto = soup.get_text(separator=' ', strip=True)
        
        logger.info(f"Webpage extraída com sucesso! ({len(texto)} caracteres)")
        return texto[:15000]
    except Exception as e:
        logger.warning(f"Erro ao extrair Webpage ({url}): {e}")
        return ""

def generate_resource_metadata(title: str, resource_type: str, url: str = None) -> AIResult:
    scraped_content = ""
    
    # 1. Tentar fazer a coleta de dados baseado no tipo ou URL
    if url:
        if "youtube.com" in url or "youtu.be" in url:
            scraped_content = extract_youtube_transcript(url)
        else:
            # Assumimos que é um link ou PDF que podemos tentar ler a página
            scraped_content = extract_webpage_text(url)

    # 2. Construir o Prompt com ou sem conteúdo
    prompt = build_smart_assist_prompt(title, resource_type, scraped_content)
    
    # 3. Chamar a IA
    try:
        # Tenta o Gemini primeiro (Prioridade)
        data = call_gemini(prompt)
        return AIResult(
            descricao=data.get("descricao", ""),
            tags=data.get("tags", [])[:3],
            provider="Gemini",
            fallback_used=False
        )
    except Exception as e:
        logger.warning(f"[WARN] Gemini falhou ({e}). Iniciando Fallback para OpenAI...")
        
        try:
            # Fallback para OpenAI
            data = call_openai(prompt)
            return AIResult(
                descricao=data.get("descricao", ""),
                tags=data.get("tags", [])[:3],
                provider="OpenAI",
                fallback_used=True
            )
        except Exception as fallback_error:
            logger.error(f"[ERROR] Ambos os provedores falharam: {fallback_error}")
            raise RuntimeError("Serviços de IA temporariamente indisponíveis.")