# auth/password.py

from passlib.context import CryptContext
import bcrypt

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """
    Hashes a given password using the bcrypt algorithm.
    
    Args:
        password (str): The password to be hashed.
        
    Returns:
        str: The hashed password.
    """
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifies if a plain text password matches the given hashed password.
    
    Args:
        plain_password (str): The plain text password to be verified.
        hashed_password (str): The hashed password for comparison.
        
    Returns:
        bool: True if the passwords match, False otherwise.
    """
    return pwd_context.verify(plain_password, hashed_password)

def check_bcrypt_password(password: str, hashed_password: bytes) -> bool:
    """
    Checks a plain text password against a bcrypt-hashed password.
    
    Args:
        password (str): The plain text password to be checked.
        hashed_password (bytes): The bcrypt-hashed password for comparison.
        
    Returns:
        bool: True if the passwords match, False otherwise.
    """
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password)