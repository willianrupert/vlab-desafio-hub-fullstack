import logging
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

def generate_resource_metadata(title: str, resource_type: str) -> AIResult:
    prompt = build_smart_assist_prompt(title, resource_type)
    
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