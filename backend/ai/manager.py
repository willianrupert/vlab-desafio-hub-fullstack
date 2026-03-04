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

# USO DE RECURSO MODERNO: Dataclass para padronizar o tráfego interno de dados
@dataclass
class AIResult:
    descricao: str
    tags: list[str]
    provider: str
    fallback_used: bool
    token_usage: int = field(default=150) # Simulado para o log, já que APIs variam a devolução

def extract_youtube_transcript(url: str) -> str:
    """Extrai a transcrição de um vídeo do YouTube."""
    try:
        video_id_match = re.search(r'(?:v=|\/)([0-9A-Za-z_-]{11}).*', url)
        if not video_id_match:
            return ""
        video_id = video_id_match.group(1)
        transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=['pt', 'en'])
        texto = " ".join([t['text'] for t in transcript])
        return texto[:15000] # Limite para não explodir tokens
    except Exception as e:
        logger.warning(f"Erro ao extrair YouTube: {e}")
        return ""

def extract_webpage_text(url: str) -> str:
    """Extrai texto de uma página web comum."""
    try:
        headers = {'User-Agent': 'Mozilla/5.0'} # Para evitar bloqueios básicos
        response = requests.get(url, headers=headers, timeout=5)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Remove scripts e estilos
        for script in soup(["script", "style"]):
            script.extract()
            
        texto = soup.get_text(separator=' ', strip=True)
        return texto[:15000]
    except Exception as e:
        logger.warning(f"Erro ao extrair Webpage: {e}")
        return ""

def generate_resource_metadata(title: str, resource_type: str, url: str = None) -> AIResult:
    scraped_content = ""
    
    # 1. Tentar fazer scraping baseado no tipo ou URL
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