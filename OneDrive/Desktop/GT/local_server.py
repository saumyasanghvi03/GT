import os
import torch
import whisper
from fastapi import FastAPI, UploadFile, File, Form
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
import uvicorn
import tempfile

app = FastAPI(title="BlockVista Pitch Backend")

# --- Model Loading ---
MODEL_ID = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
print(f"Loading LLM: {MODEL_ID}...")
tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)
model = AutoModelForCausalLM.from_pretrained(MODEL_ID, device_map="auto", torch_dtype=torch.float16)
llm_pipe = pipeline("text-generation", model=model, tokenizer=tokenizer)

print("Loading Whisper (Base)...")
stt_model = whisper.load_model("base")

@app.get("/health")
def health():
    return {"status": "online", "model": MODEL_ID}

@app.post("/generate")
async def generate(system_prompt: str = Form(...), user_input: str = Form(...), max_length: int = Form(512)):
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_input},
    ]
    prompt = llm_pipe.tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
    outputs = llm_pipe(prompt, max_new_tokens=max_length, do_sample=True, temperature=0.7)
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
