from fastapi import FastAPI, Depends, HTTPException, Response
from fastapi.security import OAuth2PasswordBearer
import jwt
from bson.json_util import dumps
from datetime import timedelta
from models.User import User

app = FastAPI()

# Define the OAuth2 password bearer scheme for authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def decode_token(token: str):
    """
    Decodes a JWT token and returns the user ID if valid.
    
    Args:
        token (str): The JWT token to decode.
        
    Returns:
        str: The authenticated user's ID.
        
    Raises:
        HTTPException: If the token is invalid or has expired.
    """
    try:
        # Decode the token using a secret key
        payload = jwt.decode(token, "SECRET_KEY", algorithms=["HS256"])
        return payload['sub']
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get("/auth/register")
async def register():
    """
    Handles user registration.
    
    Returns:
        Response: A response indicating the result of the registration attempt.
    """
    # Logic to handle user registration
    pass

@app.post("/auth/login")
async def login(token: str = Depends(oauth2_scheme)):
    """
    Handles user login and returns a JWT token if successful.
    
    Args:
        token (str): The authentication token provided by the client.
        
    Returns:
        Response: A response containing the JWT token or an error message.
    """
    # Logic to handle user login
    try:
        user_id = decode_token(token)
        return {"token": jwt.encode({"sub": user_id, "exp": datetime.utcnow() + timedelta(hours=1)}, "SECRET_KEY", algorithm="HS256")}
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)

@app.post("/auth/forgot-password")
async def forgot_password():
    """
    Handles the process of resetting a user's password.
    
    Returns:
        Response: A response indicating the result of the password reset attempt.
    """
    # Logic to handle password reset
    pass

@app.get("/entries/export", response_class=Response)
async def export_entries(request: Request):
    """
    GET handler: Fetch all of the authenticated user's entries, return them as a downloadable JSON file with Content-Disposition header "attachment; filename=entries.json".
    
    Args:
        request (Request): The incoming HTTP request.
        
    Returns:
        Response: A response containing the user's entries in a downloadable JSON file.
    """
    # Extract the token from the authorization header
    token = request.headers.get("Authorization")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        user_id = decode_token(token)
        # Fetch all entries for the authenticated user from the database
        entries = User.find({"user_id": user_id}).to_json()
        
        # Create a response with the JSON data and set the appropriate headers
        return Response(content=entries, media_type="application/json", headers={"Content-Disposition": "attachment; filename=entries.json"})
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)