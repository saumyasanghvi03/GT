import os
import torch
import whisper
import threading
from fastapi import FastAPI, UploadFile, File, Form
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
import uvicorn
import tempfile

app = FastAPI(title="BlockVista Pitch Backend")

# --- Model Config ---
MODELS = {
    "tiny": "TinyLlama/TinyLlama-1.1B-Chat-v1.0",
    "llama2": "NousResearch/Llama-2-7b-chat-hf"
}

# Current loaded model state
current_model_id = None
llm_pipe = None
stt_model = None
load_lock = threading.Lock()

def get_llm(model_key: str = "tiny"):
    global current_model_id, llm_pipe
    target_id = MODELS.get(model_key, MODELS["tiny"])
    
    with load_lock:
        if current_model_id != target_id:
            print(f"Switching LLM to: {target_id}...")
            # Clear old memory if possible
            llm_pipe = None
            import gc
            gc.collect()
            if torch.cuda.is_available():
                torch.cuda.empty_cache()
            
            tokenizer = AutoTokenizer.from_pretrained(target_id)
            # Use AirLLM logic for the big one if it's llama2 to save RAM, 
            # or standard transformers for tiny
            if model_key == "llama2":
                # Llama-2-7b specifically
                model = AutoModelForCausalLM.from_pretrained(target_id, device_map="auto", torch_dtype=torch.float16, low_cpu_mem_usage=True)
            else:
                model = AutoModelForCausalLM.from_pretrained(target_id, device_map="auto", torch_dtype=torch.float16)
                
            llm_pipe = pipeline("text-generation", model=model, tokenizer=tokenizer)
            current_model_id = target_id
            print(f"Model {target_id} loaded successfully.")
    return llm_pipe

@app.on_event("startup")
def startup():
    global stt_model, current_model_id
    print("Loading Whisper (Base) on startup...")
    stt_model = whisper.load_model("base")
    current_model_id = "None (Ready to load)"

@app.get("/health")
def health():
    return {"status": "online", "current_model": current_model_id}

@app.post("/generate")
async def generate(system_prompt: str = Form(...), user_input: str = Form(...), max_length: int = Form(512), model_key: str = Form("tiny")):
    pipe = get_llm(model_key)
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_input},
    ]
    prompt = pipe.tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
    outputs = pipe(prompt, max_new_tokens=max_length, do_sample=True, temperature=0.7)
    response = outputs[0]["generated_text"].split("<|assistant|>")[-1].strip()
    return {"response": response}

@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
        content = await file.read()
        tmp.write(content)
        tmp_path = tmp.name
    
    result = stt_model.transcribe(tmp_path)
    os.remove(tmp_path)
    return {"text": result["text"]}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
