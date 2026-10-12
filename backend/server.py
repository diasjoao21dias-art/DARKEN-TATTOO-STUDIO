from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import os
import uuid
import logging
from datetime import datetime, timezone, timedelta
from typing import Annotated, List, Optional

import bcrypt
import jwt
import requests
from bson import ObjectId
from fastapi import FastAPI, APIRouter, HTTPException, Request, UploadFile, File, Form, Header, Query, Response, Depends
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import AliasChoices, BaseModel, BeforeValidator, ConfigDict, Field, EmailStr
from starlette.concurrency import run_in_threadpool
from starlette.middleware.cors import CORSMiddleware

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

client = AsyncIOMotorClient(os.environ["MONGO_URL"])
db = client[os.environ["DB_NAME"]]

app = FastAPI()
api = APIRouter(prefix="/api")

# ---------- Mongo models ----------
PyObjectId = Annotated[str, BeforeValidator(lambda v: str(v) if isinstance(v, ObjectId) else v)]


class BaseDocument(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="ignore")
    id: Optional[PyObjectId] = Field(default=None, validation_alias=AliasChoices("_id", "id"))

    @classmethod
    def from_mongo(cls, doc):
        return cls.model_validate(doc) if doc else None

    def to_mongo(self):
        return self.model_dump(exclude={"id"}, exclude_none=True)


class RefImage(BaseModel):
    path: str
    filename: str
    content_type: str


class DesignRequest(BaseDocument):
    name: str
    email: str
    whatsapp: str
    style: str
    placement: str
    size: str
    budget: str
    description: str
    images: List[RefImage] = []
    status: str = "pendente"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


STATUSES = {"pendente", "em_analise", "aprovado", "concluido", "recusado"}

# ---------- Storage ----------
STORAGE_BASE = (os.environ.get("INTEGRATION_PROXY_URL") or "").strip() or "https://integrations.emergentagent.com"
STORAGE_URL = STORAGE_BASE.rstrip("/") + "/objstore/api/v1/storage"
APP_NAME = "darken-tattoo"
storage_key = None


def init_storage(force: bool = False):
    global storage_key
    if storage_key and not force:
        return storage_key
    resp = requests.post(f"{STORAGE_URL}/init", json={"emergent_key": os.environ["EMERGENT_LLM_KEY"]}, timeout=30)
    resp.raise_for_status()
    storage_key = resp.json()["storage_key"]
    return storage_key


def put_object(path: str, data: bytes, content_type: str) -> dict:
    resp = requests.put(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": init_storage(), "Content-Type": content_type}, data=data, timeout=120)
    if resp.status_code == 404:
        resp = requests.put(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": init_storage(True), "Content-Type": content_type}, data=data, timeout=120)
    resp.raise_for_status()
    return resp.json()


def get_object(path: str):
    resp = requests.get(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": init_storage()}, timeout=60)
    resp.raise_for_status()
    return resp.content, resp.headers.get("Content-Type", "application/octet-stream")


# ---------- Auth ----------
JWT_ALG = "HS256"


def hash_password(p: str) -> str:
    return bcrypt.hashpw(p.encode(), bcrypt.gensalt()).decode()


def verify_password(p: str, h: str) -> bool:
    return bcrypt.checkpw(p.encode(), h.encode())


def create_token(user_id: str, email: str) -> str:
    payload = {"sub": user_id, "email": email, "type": "access", "exp": datetime.now(timezone.utc) + timedelta(hours=12)}
    return jwt.encode(payload, os.environ["JWT_SECRET"], algorithm=JWT_ALG)


async def current_admin(authorization: str = Header(None), auth: str = Query(None)):
    token = auth or (authorization[7:] if authorization and authorization.startswith("Bearer ") else None)
    if not token:
        raise HTTPException(401, "Não autenticado")
    try:
        payload = jwt.decode(token, os.environ["JWT_SECRET"], algorithms=[JWT_ALG])
    except jwt.ExpiredSignatureError:
        raise HTTPException(401, "Sessão expirada")
    except jwt.InvalidTokenError:
        raise HTTPException(401, "Token inválido")
    user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
    if not user or user.get("role") != "admin":
        raise HTTPException(401, "Acesso negado")
    return {"id": str(user["_id"]), "email": user["email"], "name": user.get("name", "Admin")}


class LoginIn(BaseModel):
    email: EmailStr
    password: str


@api.post("/auth/login")
async def login(body: LoginIn, request: Request):
    email = body.email.lower()
    ident = f"{request.client.host if request.client else 'x'}:{email}"
    attempt = await db.login_attempts.find_one({"identifier": ident})
    now = datetime.now(timezone.utc)
    if attempt and attempt.get("count", 0) >= 5 and datetime.fromisoformat(attempt["last"]) > now - timedelta(minutes=15):
        raise HTTPException(429, "Muitas tentativas. Tente novamente em 15 minutos.")
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(body.password, user["password_hash"]):
        await db.login_attempts.update_one({"identifier": ident}, {"$inc": {"count": 1}, "$set": {"last": now.isoformat()}}, upsert=True)
        raise HTTPException(401, "E-mail ou senha inválidos")
    await db.login_attempts.delete_one({"identifier": ident})
    return {"token": create_token(str(user["_id"]), email), "user": {"email": email, "name": user.get("name", "Admin")}}


@api.get("/auth/me")
async def me(admin=Depends(current_admin)):
    return admin


# ---------- Design requests ----------
ALLOWED_IMG = {"image/jpeg", "image/png", "image/webp", "image/gif", "image/heic", "image/heif"}
MAX_IMG = 8 * 1024 * 1024


@api.get("/")
async def root():
    return {"message": "Darken Tattoo Studio API"}


@api.post("/requests", status_code=201)
async def create_request(
    name: str = Form(..., min_length=2, max_length=120),
    email: EmailStr = Form(...),
    whatsapp: str = Form(..., min_length=8, max_length=30),
    style: str = Form(..., max_length=60),
    placement: str = Form(..., max_length=60),
    size: str = Form(..., max_length=60),
    budget: str = Form(..., max_length=60),
    description: str = Form(..., min_length=10, max_length=3000),
    files: List[UploadFile] = File(default=[]),
):
    files = [f for f in files if f and f.filename]
    if len(files) > 3:
        raise HTTPException(400, "Envie no máximo 3 imagens de referência")
    req_id = uuid.uuid4().hex
    images = []
    for f in files:
        if f.content_type not in ALLOWED_IMG:
            raise HTTPException(400, f"Formato não suportado: {f.filename}")
        data = await f.read()
        if len(data) > MAX_IMG:
            raise HTTPException(400, f"Imagem muito grande (máx 8MB): {f.filename}")
        ext = f.filename.rsplit(".", 1)[-1].lower() if "." in f.filename else "jpg"
        try:
            result = await run_in_threadpool(put_object, f"{APP_NAME}/requests/{req_id}/{uuid.uuid4().hex}.{ext}", data, f.content_type)
        except Exception as e:
            logger.error(f"Upload failed: {e}")
            raise HTTPException(502, "Falha ao enviar imagens. Tente novamente.")
        images.append(RefImage(path=result["path"], filename=f.filename, content_type=f.content_type))
    doc = DesignRequest(name=name.strip(), email=email.lower(), whatsapp=whatsapp.strip(), style=style, placement=placement,
                        size=size, budget=budget, description=description.strip(), images=images)
    res = await db.design_requests.insert_one(doc.to_mongo())
    doc.id = str(res.inserted_id)
    return {"id": doc.id, "status": doc.status}


@api.get("/admin/requests", response_model=List[DesignRequest])
async def list_requests(status: Optional[str] = None, admin=Depends(current_admin)):
    q = {"status": status} if status in STATUSES else {}
    docs = await db.design_requests.find(q).sort("created_at", -1).to_list(500)
    return [DesignRequest.from_mongo(d) for d in docs]


class StatusIn(BaseModel):
    status: str


@api.patch("/admin/requests/{req_id}", response_model=DesignRequest)
async def update_status(req_id: str, body: StatusIn, admin=Depends(current_admin)):
    if body.status not in STATUSES or not ObjectId.is_valid(req_id):
        raise HTTPException(400, "Dados inválidos")
    doc = await db.design_requests.find_one_and_update({"_id": ObjectId(req_id)}, {"$set": {"status": body.status}}, return_document=True)
    if not doc:
        raise HTTPException(404, "Solicitação não encontrada")
    return DesignRequest.from_mongo(doc)


@api.get("/admin/files/{path:path}")
async def get_file(path: str, admin=Depends(current_admin)):
    found = await db.design_requests.find_one({"images.path": path})
    if not found:
        raise HTTPException(404, "Arquivo não encontrado")
    data, ctype = await run_in_threadpool(get_object, path)
    return Response(content=data, media_type=ctype, headers={"Cache-Control": "private, max-age=3600"})


app.include_router(api)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier")
    email, pw = os.environ["ADMIN_EMAIL"].lower(), os.environ["ADMIN_PASSWORD"]
    existing = await db.users.find_one({"email": email})
    if not existing:
        await db.users.insert_one({"email": email, "password_hash": hash_password(pw), "name": "Darken", "role": "admin",
                                   "created_at": datetime.now(timezone.utc).isoformat()})
    elif not verify_password(pw, existing["password_hash"]):
        await db.users.update_one({"email": email}, {"$set": {"password_hash": hash_password(pw)}})
    try:
        init_storage()
        logger.info("Storage initialized")
    except Exception as e:
        logger.error(f"Storage init failed: {e}")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
