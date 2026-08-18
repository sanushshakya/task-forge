# auth/password.py

import bcrypt
from passlib.context import CryptContext

# Create a password context with default settings
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """
    Hashes a given password using bcrypt.
    
    Args:
        password (str): The plaintext password to be hashed.
    
    Returns:
        str: The hashed password.
    """
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifies if the provided plaintext password matches the given hashed password.
    
    Args:
        plain_password (str): The plaintext password to be verified.
        hashed_password (str): The hashed password to compare against.
    
    Returns:
        bool: True if the passwords match, False otherwise.
    """
    return pwd_context.verify(plain_password, hashed_password)