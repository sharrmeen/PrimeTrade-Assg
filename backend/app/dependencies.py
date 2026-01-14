from fastapi import Depends,HTTPException,status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError,jwt
from app.auth import SECRET_KEY,ALGORITHM
from app.database import db

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

async def getCurrentUser(token:str=Depends(oauth2_scheme)):
    credentials_excpetion=HTTPException(
       status_code=status.HTTP_401_UNAUTHORIZED,
       detail="Could not validate user",
       headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload=jwt.decode(token,SECRET_KEY,algorithms=[ALGORITHM])
        user_id:str=payload.get("sub")
        if user_id is  None:
            raise credentials_excpetion
    except JWTError:
        raise credentials_excpetion
    user=await db.user.find_unique(where={"id":user_id})
    if user is None:
        raise credentials_excpetion
    return user


def requireAdmin(user=Depends(getCurrentUser)):
    if user.role!="ADMIN":
        raise HTTPException(status_code=403,detail="Admin privileges required")
    return user
    
