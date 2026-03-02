import os
import json
from google import genai
from google.genai import types
from dotenv import load_dotenv

# Força o carregamento do .env toda vez que a IA for chamada
load_dotenv()

def call_gemini(prompt: str) -> dict:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("Chave GEMINI_API_KEY não encontrada. Verifique o arquivo .env!")
        
    client = genai.Client(api_key=api_key)
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt,
        config=types.GenerateContentConfig(response_mime_type="application/json"),
    )
    return json.loads(response.text)