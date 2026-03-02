import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

def call_openai(prompt: str) -> dict:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("Chave OPENAI_API_KEY não encontrada. Verifique o arquivo .env!")
        
    client = OpenAI(api_key=api_key)
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        response_format={ "type": "json_object" },
        messages=[
            {"role": "system", "content": "You output strict JSON only."},
            {"role": "user", "content": prompt}
        ]
    )
    return json.loads(response.choices[0].message.content)