"""
Darken Tattoo Studio — o site é 100% estático (React) e não usa banco de dados.
Este backend existe apenas como stub de health-check para o ambiente de preview.
"""
from fastapi import FastAPI, APIRouter

app = FastAPI()
api = APIRouter(prefix="/api")


@api.get("/health")
def health():
    return {"status": "ok", "mode": "static-site"}


app.include_router(api)
