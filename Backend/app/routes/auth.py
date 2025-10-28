from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.user import User
from app.services.auth_service import hash_password, verify_password, create_access_token

router = APIRouter(tags=["Authentication"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register")
def register_user(data: dict, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == data["email"]).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = hash_password(data["password"])
    new_user = User(username=data["username"], email=data["email"], password=hashed_pw)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully"}

@router.post("/login")
def login_user(data: dict, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data["email"]).first()
    if not user or not verify_password(data["password"], user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}
