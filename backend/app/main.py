import logging
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.database import db
from app.auth import hash_password, verify_password, create_access_token
from app.schemas import UserCreate, UserLogin, UserResponse, Token, TaskCreate, TaskResponse
from app.dependencies import getCurrentUser,requireAdmin
from typing import List

logging.basicConfig(filename="server.log", level=logging.INFO, format="%(asctime)s - %(message)s")

@asynccontextmanager
async def lifespan(app: FastAPI):
    await db.connect()
    yield
    await db.disconnect()

app = FastAPI(lifespan=lifespan, title="PrimeTrade Backend Assignment")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/auth/register", response_model=UserResponse)
async def register(user_data: UserCreate):
    hashed = hash_password(user_data.password)
    try:
        user = await db.user.create(
            data={"name":user_data.name,"email": user_data.email, "password": hashed, "role": user_data.role}
        )
        return user
    except Exception as e:
        print(f"DATABASE ERROR: {e}") 
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/auth/login", response_model=Token)
async def login(user_data: UserLogin):
    user = await db.user.find_unique(where={"email": user_data.email})
    if not user or not verify_password(user_data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token(data={"sub": user.id, "role": user.role})
    return {"access_token": token, "token_type": "bearer"}


@app.get("/tasks", response_model=List[TaskResponse])
async def get_tasks(current_user = Depends(getCurrentUser)):
    if current_user.role == "ADMIN":
        return await db.task.find_many()
    return await db.task.find_many(where={"ownerId": current_user.id})

@app.post("/tasks", response_model=TaskResponse)
async def create_task(task: TaskCreate, current_user = Depends(getCurrentUser)):
    return await db.task.create(
        data={**task.dict(), "ownerId": current_user.id}
    )

@app.delete("/tasks/{task_id}")
async def delete_task(task_id: str, current_user = Depends(getCurrentUser)):
    task = await db.task.find_unique(where={"id": task_id})
    if not task: raise HTTPException(status_code=404)
    
    if current_user.role != "ADMIN" and task.ownerId != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    await db.task.delete(where={"id": task_id})
    return {"message": "Deleted successfully"}