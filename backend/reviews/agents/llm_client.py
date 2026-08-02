import os
import google.generativeai as genai

def call_llm(prompt: str) -> str:
    """
    Sends a prompt to the Google Gemini API using supported models (gemini-3.6-flash, etc.)
    and returns the plain text response.
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable is not set.")

    genai.configure(api_key=api_key)
    
    # List of candidate models in order of priority/availability
    candidate_models = [
        "gemini-3.6-flash",
        "gemini-3.1-flash-lite",
        "gemini-2.0-flash",
        "gemini-2.0-flash-lite"
    ]
    
    last_err = None
    for model_name in candidate_models:
        try:
            model = genai.GenerativeModel(model_name)
            response = model.generate_content(prompt)
            if response and response.text:
                return response.text
        except Exception as e:
            last_err = e
            continue

    raise RuntimeError(f"All Gemini models failed. Last error: {last_err}")

def parse_json_response(response_text: str) -> dict:
    """
    Strips markdown code fences if present and parses raw JSON string.
    """
    text = response_text.strip()
    if text.startswith("```"):
        lines = text.splitlines()
        if lines[0].startswith("```"):
            lines = lines[1:]
        if lines and lines[-1].strip() == "```":
            lines = lines[:-1]
        text = "\n".join(lines).strip()

    # Extract JSON object boundaries if extra text surrounds it
    start_idx = text.find("{")
    end_idx = text.rfind("}")
    if start_idx != -1 and end_idx != -1 and end_idx >= start_idx:
        text = text[start_idx:end_idx + 1]

    import json
    return json.loads(text)
