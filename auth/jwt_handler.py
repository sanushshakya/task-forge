# auth/jwt_handler.py

import jwt
from datetime import datetime, timedelta
from typing import Optional

# Import user model for decoding JWT payload
from models.User import User

# Secret key for JWT encoding/decoding
JWT_SECRET_KEY = 'your_secret_key_here'
ALGORITHM = "HS256"

def encode_jwt(payload: dict) -> str:
    """
    Encode a dictionary containing user information into a JWT token.
    
    Args:
        payload (dict): Dictionary containing user data to be encoded.
    
    Returns:
        str: Encoded JWT token.
    """
    # Set expiration time for the token
    expire = datetime.utcnow() + timedelta(days=1)
    payload.update({"exp": expire})
    
    # Encode the payload and return as a JWT token
    encoded_jwt = jwt.encode(payload, JWT_SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_jwt(token: str) -> Optional[dict]:
    """
    Decode a JWT token to retrieve user information.
    
    Args:
        token (str): JWT token to be decoded.
    
    Returns:
        dict or None: Decoded payload if successful, otherwise None.
    """
    try:
        # Decode the JWT token and return the payload
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        # Token has expired
        return None
    except jwt.InvalidTokenError:
        # Invalid token
        return None

# Example usage
if __name__ == "__main__":
    user_payload = {"user_id": "123", "username": "john_doe"}
    encoded_token = encode_jwt(user_payload)
    print(f"Encoded JWT: {encoded_token}")
    
    decoded_payload = decode_jwt(encoded_token)
    if decoded_payload:
        print(f"Decoded Payload: {decoded_payload}")
```

This Python script provides functions to encode and decode JSON Web Tokens (JWTs) using a secret key. The `encode_jwt` function takes a dictionary containing user information and returns an encoded JWT token with an expiration time. The `decode_jwt` function attempts to decode a JWT token and return the payload, handling exceptions for expired or invalid tokens.