// schemas/auth.py

from pydantic import BaseModel
from datetime import datetime

class LoginRequest(BaseModel):
    """
    Schema for login request containing email and password.
    """
    email: str
    password: str

class RegisterRequest(BaseModel):
    """
    Schema for registration request containing username, email, and password.
    """
    username: str
    email: str
    password: str

class TokenResponse(BaseModel):
    """
    Schema for the token response containing access token and expiration time.
    """
    access_token: str
    token_type: str
    expires_at: datetime