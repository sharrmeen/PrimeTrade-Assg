from pydantic import BaseModel,EmailStr
from typing import Optional,List
from enum import Enum

class RoleEnum(str,Enum):
    USER="USER"
    ADMIN="ADMIN"

class UserCreate(BaseModel):
    name:str
    email:EmailStr
    password:str
    role:Optional[RoleEnum]=RoleEnum.USER

class UserLogin(BaseModel):
    email:EmailStr
    password:str

class UserResponse(BaseModel):
    id:str
    name:str
    email:str
    role:str
    class Config:
        from_attributes=True
        
class Token(BaseModel):
    access_token:str
    token_type:str
    
class TaskBase(BaseModel):
    title:str
    description:str
    
class TaskCreate(TaskBase):
    pass

class TaskResponse(TaskBase):
    id:str
    status:str
    ownerId:str
    class Config:
        from_attributes=True
    
   
    
    
     