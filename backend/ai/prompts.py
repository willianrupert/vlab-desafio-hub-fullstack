def build_smart_assist_prompt(title: str, resource_type: str, scraped_content: str = "") -> str:
    """
    Constrói o prompt otimizado usando as melhores práticas de Engenharia de Prompt.
    Incorpora conteúdo base da URL (se existir) para gerar uma descrição extremamente rica.
    """

    context_block = ""
    if scraped_content:
        context_block = f"""
# EXTRACTED CONTENT
```
{scraped_content[:15000]}
```
"""

    has_content = bool(scraped_content)

    description_guideline = (
        """2. DESCRIPTION RULES (with extracted content):
   - Write 2 to 3 sentences in Portuguese (pt-BR). No more.
   - Sentence 1: State the core thesis or main argument of the material.
   - Sentence 2: Mention 2-3 specific topics, techniques, or concepts actually covered.
   - Sentence 3 (optional): Name the author/speaker if clearly identifiable in the text, and who benefits most from this material.
   - Be specific. Avoid vague phrases like "this material covers..." or "you will learn...".
   - Prefer active, direct language: "O autor demonstra...", "O vídeo apresenta...", "O artigo analisa..."."""
        if has_content else
        """2. DESCRIPTION RULES (title-only inference):
   - Write 2 sentences in Portuguese (pt-BR). No more.
   - Sentence 1: Based on the title alone, infer and state the likely core subject of the material.
   - Sentence 2: Describe what a student is likely to gain or practice from this type of resource.
   - Avoid generic filler. Be direct and specific to the title provided."""
    )

    return f"""You are an Expert Pedagogical Assistant specializing in cataloging educational resources.

## YOUR TASK
Analyze the inputs below and generate a JSON object with a concise description and tags in Portuguese (pt-BR).
{context_block}
## INPUTS
- Title: "{title}"
- Type: "{resource_type}"
- Content available: {"YES — prioritize the extracted content over the title alone" if has_content else "NO — infer from title only"}

## RULES

1. LANGUAGE: All output values MUST be in Portuguese (pt-BR). No exceptions.

{description_guideline}

3. TAGS RULES:
   - Provide exactly 3 tags.
   - Each tag must be a single lowercase word or short compound (e.g., "machine-learning").
   - Tags must reflect the actual subject matter, not the format (avoid tags like "vídeo" or "pdf").
   - Order by relevance: most specific first.

4. STRICT CONSTRAINTS:
   - Do NOT hallucinate authors or topics not present in the content or title.
   - Do NOT start the description with "Este material", "Neste recurso" or "Este vídeo/PDF/link".
   - Do NOT include any explanation outside the JSON object.

## OUTPUT FORMAT
Respond ONLY with this exact JSON structure, nothing else:
{{
    "descricao": "<2-3 sentence description in pt-BR>",
    "tags": ["<tag1>", "<tag2>", "<tag3>"]
}}"""