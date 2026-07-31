from typing import Optional
import jwt

class JWTDependency:
    """
    Dependency for decoding a JWT token and returning the current user.

    Attributes:
        secret_key (str): The secret key used to decode the JWT token.
    """

    def __init__(self, secret_key: str):
        """
        Initializes the JWTDependency with a secret key.

        Args:
            secret_key (str): The secret key used to decode the JWT token.
        """
        self.secret_key = secret_key

    async def get_current_user(self, request) -> Optional[dict]:
        """
        Decodes the JWT token from the request headers and returns the current user if valid.

        Args:
            request: The incoming request object containing the JWT token in the Authorization header.

        Returns:
            Optional[dict]: A dictionary representing the current user if the token is valid, None otherwise.
        """
        try:
            # Extract the token from the Authorization header
            auth_header = request.headers.get('Authorization')
            if not auth_header or 'Bearer' not in auth_header:
                return None

            token = auth_header.split()[1]
            
            # Decode the JWT token
            decoded_token = jwt.decode(token, self.secret_key, algorithms=["HS256"])
            return decoded_token
        
        except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
            # Return None if the token is expired or invalid
            return None

# Example usage in a route handler
from fastapi import FastAPI, Depends

app = FastAPI()

# Dependency injection for JWT decoding
jwt_dependency = JWTDependency(secret_key="your_secret_key_here")

@app.get("/user")
async def get_user(current_user=Depends(jwt_dependency.get_current_user)):
    """
    Retrieves the current user based on the JWT token in the request headers.

    Args:
        current_user: The decoded current user dictionary from the JWT dependency.

    Returns:
        dict: A JSON response containing the current user's information.
    """
    if current_user is None:
        return {"message": "Unauthorized"}, 401
    
    return {"user": current_user}