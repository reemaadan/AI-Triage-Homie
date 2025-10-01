# app/main.py
from fastapi import FastAPI
from app.routes import snapshot

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # Vite dev
        "http://127.0.0.1:5173",
        "http://localhost:5500",   # simple static
        "http://127.0.0.1:5500",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "API is running. Try /health or /docs"}

@app.get("/health")
def health():
    return {"ok": True}

# Mount app routes
app.include_router(snapshot.router, tags=["app"])
