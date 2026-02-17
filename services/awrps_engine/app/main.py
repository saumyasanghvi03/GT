from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import random

app = FastAPI()

class FeatureVector(BaseModel):
    values: List[float]

@app.get('/health')
def health():
    return {'status': 'ok'}

@app.post('/score')
def score(payload: FeatureVector):
    base = sum(payload.values) / max(len(payload.values), 1)
    return {'score': round(min(100, max(0, base * 10 + random.uniform(5, 25))), 2)}
