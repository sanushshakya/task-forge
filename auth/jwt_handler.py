from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from typing import Optional
from jose import JWTError, jwt
from datetime import datetime, timedelta

# Import the User model from models/index.ts
from models import User
from auth.dependencies import get_current_user
from lib.env import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from lib.auth.types import TokenData

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

app = FastAPI()

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """
    Creates a JWT access token with the provided data and optional expiration time.
    
    Args:
        data (dict): The data to be encoded in the token.
        expires_delta (Optional[timedelta]): The time until the token expires. Defaults to None.
        
    Returns:
        str: The encoded JWT access token.
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    """
    Retrieves the current user from the JWT token.
    
    Args:
        token (str): The JWT access token.
        
    Returns:
        User: The current user.
    """
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    user = await get_user_by_email(email=token_data.email)
    if user is None:
        raise credentials_exception
    return user

async def get_user_by_email(email: str):
    """
    Retrieves a user by their email address.
    
    Args:
        email (str): The email address of the user.
        
    Returns:
        User: The user with the provided email address, if found.
    """
    # Placeholder for actual database query logic
    return await User.find_one({"email": email})