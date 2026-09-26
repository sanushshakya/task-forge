// schemas/auth.py

from pydantic import BaseModel, EmailStr, Field

class LoginRequest(BaseModel):
    """
    Pydantic model for login request.

    Attributes:
        email (EmailStr): The user's email address.
        password (str): The user's password.
    """
    email: EmailStr
    password: str = Field(..., min_length=8)

class RegisterRequest(BaseModel):
    """
    Pydantic model for registration request.

    Attributes:
        username (str): The user's username.
        email (EmailStr): The user's email address.
        password (str): The user's password.
    """
    username: str
    email: EmailStr
    password: str = Field(..., min_length=8)

class TokenResponse(BaseModel):
    """
    Pydantic model for token response.

    Attributes:
        access_token (str): The access token.
        token_type (str): The type of the token.
    """
    access_token: str
    token_type: str = "bearer"