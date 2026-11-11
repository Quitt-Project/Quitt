from fastapi import FastAPI
from app.schemas.user import UserRegister
from app.security import hash_password

app = FastAPI()

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/register")
def register(user: UserRegister):
    hashed_password = hash_password(user.password)

    return{
        "name": user.name,
        "email": user.email,
        "message": "Registrierung erhalten"
    }
