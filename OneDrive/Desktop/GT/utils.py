import os
import streamlit as st
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
import torch

# TinyLlama fits easily in RAM, so we use standard Transformers
DEFAULT_MODEL_ID = "TinyLlama/TinyLlama-1.1B-Chat-v1.0" 

@st.cache_resource
def init_airllm(model_id=DEFAULT_MODEL_ID, mock=False):
    """
    Initializes the LLM (Transformers) or returns a Mock object.
    Renamed hook but keeps function signature for compatibility.
    """
    if mock:
        print("Initializing Mock AI...")
        return "MOCK_MODEL"
        
    print(f"Initializing Transformers with model: {model_id}...")
    try:
        tokenizer = AutoTokenizer.from_pretrained(model_id)
        model = AutoModelForCausalLM.from_pretrained(
            model_id, 
            device_map="auto", 
            torch_dtype=torch.float16
        )
        # Create a pipeline for easier generation
        pipe = pipeline("text-generation", model=model, tokenizer=tokenizer)
        return pipe
    except Exception as e:
        st.error(f"Failed to initialize Model: {e}")
        return None

def load_knowledge_base():
    """
    Loads the pitch questions, answers, and notes into a dictionary.
    """
    files = {
        "pnotes": "pnotes.md",
        "questions": "pitch_questions.md",
        "answers": "pitch_answers_strategy.md"
    }
    
    knowledge = {}
    
    base_path = os.path.dirname(os.path.abspath(__file__))
    
    for key, filename in files.items():
        path = os.path.join(base_path, filename)
        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as f:
                knowledge[key] = f.read()
        else:
            knowledge[key] = f"Error: {filename} not found."
            
    return knowledge

import requests
import io

def generate_response(pipe, system_prompt, user_input, max_length=512, remote_url=None):
    """
    Generates a response using Local Transformers, Mock, or Remote API.
    """
    if remote_url:
        try:
            resp = requests.post(
                f"{remote_url}/generate",
                data={"system_prompt": system_prompt, "user_input": user_input, "max_length": max_length},
                timeout=30
            )
            return resp.json().get("response", "Error: No response from remote.")
        except Exception as e:
            return f"Remote Error: {e}"

    if not pipe:
        return "Model not initialized. Wake up the AI or check settings."
        
    if pipe == "MOCK_MODEL":
        import time # Moved import here to avoid unused import if not mocking
        time.sleep(1.5) # Simulate thinking
        if "Grade this answer" in system_prompt:
             return "**Score:** 8/10\n**Feedback:** Good strategic alignment, but you missed the 'Resilience Flywheel' (Slide 6) specific data point."
        elif "Verify" in system_prompt:
             return "[VALID] - You covered the $78B market size."
        else:
             return "**Mock AI:** I agree! The strategy is sound based on the PLI data."

    # Prompt format for TinyLlama Chat
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_input},
    ]
    
    # Use tokenizer to apply chat template
    prompt = pipe.tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
    
    try:
        outputs = pipe(
            prompt, 
            max_new_tokens=max_length, 
            do_sample=True, 
            temperature=0.7, 
            top_k=50, 
            top_p=0.95
        )
        return outputs[0]["generated_text"].split("<|assistant|>")[-1].strip()
    except Exception as e:
        return f"Error generating response: {e}"

def parse_slides(markdown_text):
    """
    Splits the pnotes markdown into a dictionary of {Slide Title: Content}.
    Assumes headers start with '## SLIDE-'.
    """
    slides = {}
    current_slide = "General Context"
    current_content = []
    
    for line in markdown_text.split('\n'):
        if line.strip().startswith("## SLIDE-") or line.strip().startswith("## APPENDIX-"):
            # Save previous
            if current_content:
                slides[current_slide] = "\n".join(current_content).strip()
            # Start new
            current_slide = line.strip().replace("#", "").strip()
            current_content = []
        else:
            current_content.append(line)
            
    # Use last
    if current_content:
        slides[current_slide] = "\n".join(current_content).strip()
        
    return slides

def remote_transcribe(audio_bytes, remote_url):
    """Sends audio bytes to local server for Whisper transcription."""
    try:
        files = {"file": ("audio.wav", audio_bytes, "audio/wav")}
        resp = requests.post(f"{remote_url}/transcribe", files=files, timeout=60)
        return resp.json().get("text", "Error: Transcription failed.")
    except Exception as e:
        return f"Remote Transcription Error: {e}"
