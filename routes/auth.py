// routes/auth.py

import { FastAPI, Request, Response, HTTPException } from "fastapi";
import { Depends, SecurityScopes } from "fastapi.security";
import { OAuth2PasswordBearer } from "fastapi.security.oauth2";
import { JWTError, JWTClaims } from "pydantic-jwt";
import { User, Team } from "../models/index";
import * as auth from "./auth/dependencies.py";
import * as password from "./auth/password.py";

const app = FastAPI()

# OAuth2 password bearer scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Dependency for JWT token authentication
async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = auth.decode_token(token)
        user_id = payload.sub
    except JWTError:
        raise credentials_exception
    user = await User.findById(user_id)
    if user is None:
        raise credentials_exception
    return user

# Register new user route
@app.post("/auth/register")
async def register_user(email: str, password: str):
    # Check if user already exists
    existing_user = await User.findOne({"email": email})
    if existing_user:
        raise HTTPException(status_code=400, detail="User already registered")

    # Create new user and hash password
    hashed_password = password.hash(password)
    new_user = await User.create({"email": email, "password": hashed_password})
    return {"message": "User created successfully"}

# Login route
@app.post("/auth/login")
async def login(email: str, password: str):
    # Find user by email
    user = await User.findOne({"email": email})
    if not user or not password.verify(password, user.password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")

    # Generate and return JWT token
    access_token = auth.create_access_token(
        data={"sub": str(user._id)}, expires_delta timedelta(days=7)
    )
    return {"access_token": access_token, "token_type": "bearer"}

# Forgot password route
@app.post("/auth/forgot-password")
async def forgot_password(email: str):
    # Find user by email
    user = await User.findOne({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Generate and send reset password token (implementation depends on your email service)
    # For demonstration purposes, we'll just return a success message
    return {"message": "Password reset email sent successfully"}