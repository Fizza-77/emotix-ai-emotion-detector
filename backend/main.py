from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline

app = FastAPI()

# Allow React frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load pre-trained emotion model
emotion_model = pipeline(
    "text-classification",
    model="j-hartmann/emotion-english-distilroberta-base",
    return_all_scores=True
)

class TextInput(BaseModel):
    text: str

@app.post("/predict")
def predict_emotion(input: TextInput):
    results = emotion_model(input.text)[0]
    top_emotion = max(results, key=lambda x: x["score"])

    return {
        "emotion": top_emotion["label"],
        "confidence": round(top_emotion["score"], 2)
    }
