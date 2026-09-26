import jwt
from datetime import datetime, timedelta

# Define JWT secret key and algorithm
JWT_SECRET_KEY = 'your_secret_key'
JWT_ALGORITHM = 'HS256'

def encode_jwt(payload: dict) -> str:
    """
    Encodes a dictionary into a JWT with an expiration time.

    Args:
        payload (dict): The data to be encoded in the JWT.

    Returns:
        str: The JWT as a string.
    """
    # Set the expiration time for the token
    payload['exp'] = datetime.utcnow() + timedelta(hours=1)
    return jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)

def decode_jwt(token: str) -> dict:
    """
    Decodes a JWT and returns the payload.

    Args:
        token (str): The JWT to be decoded.

    Returns:
        dict: The payload of the JWT.
    """
    try:
        return jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise Exception("Token has expired")
    except jwt.InvalidTokenError:
        raise Exception("Invalid token")

# Example usage
if __name__ == "__main__":
    user_id = "12345"
    payload = {"user_id": user_id}
    encoded_token = encode_jwt(payload)
    decoded_payload = decode_jwt(encoded_token)
    print(f"Encoded Token: {encoded_token}")
    print(f"Decoded Payload: {decoded_payload}")