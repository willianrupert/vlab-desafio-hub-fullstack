def build_smart_assist_prompt(title: str, resource_type: str) -> str:
    """
    Constrói o prompt otimizado usando as melhores práticas de Engenharia de Prompt.
    """
    return f"""Act as an Expert Pedagogical Assistant and Instructional Designer.
Your task is to analyze the title and type of an educational resource and generate a concise, engaging description and relevant tags.

# INPUT DATA
- Title: "{title}"
- Material Type: "{resource_type}"

# GUIDELINES
1. Description: Write a clear, useful description (maximum 2 sentences) that helps students understand the value of this resource.
2. Tags: Provide exactly 3 highly relevant, distinct keywords (tags) for categorization.
3. Language: The generated content MUST be in Portuguese (pt-BR).

# OUTPUT FORMAT (Strict JSON)
You must respond ONLY with a valid JSON object matching this exact schema:
{{
    "descricao": "The generated description here.",
    "tags": ["tag1", "tag2", "tag3"]
}}
"""