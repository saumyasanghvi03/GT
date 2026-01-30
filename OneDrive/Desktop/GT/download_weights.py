from airllm import AutoModel
import time

MODEL_ID = "NousResearch/Llama-2-7b-chat-hf"

print(f"--- STARTING DOWNLOAD FOR: {MODEL_ID} ---")
print("This involves downloading ~13GB of data (4 Shards).")
print("Please do not close this terminal until it says DONE.")

start = time.time()
try:
    # This triggers the download/cache
    model = AutoModel.from_pretrained(MODEL_ID)
    print(f"--- DOWNLOAD COMPLETE in {time.time() - start:.2f}s ---")
except Exception as e:
    print(f"FAILED: {e}")
