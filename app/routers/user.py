from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from core.db import get_db
from core.security import hash_password, verify_password
from models.user import User
from schemas.user import UserRequestDto, UserResponseDto, LoginRequestDto
from schemas.Api_response import ApiResponse
from fastapi import HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from core.jwt_helper import create_access_token, decode_access_token

user_router = APIRouter()

# Create a security scheme to receive the Bearer token
bearer_scheme = HTTPBearer()


# Get the currently logged-in user using the JWT token
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db)
):
    # Extract the JWT token from the Authorization header
    token = credentials.credentials

    # Decode the token and get the user ID
    user_id = decode_access_token(token)

    # Check whether the token is invalid or expired
    if user_id is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    # Find the user in the database using the user ID
    user = db.query(User).filter(User.id == user_id).first()

    # Check whether the user exists in the database
    if user is None:
        raise HTTPException(
            status_code=401,
            detail="User not found"
        )

    # Return the authenticated user's database record
    return user

# signup a new user
@user_router.post("/signup")
def signup(user_request_dto: UserRequestDto, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user_request_dto.email).first()
    if existing_user:
        return ApiResponse(status="error", message="Email already registered", data=None)

    new_user = User(
        user_name=user_request_dto.user_name,
        email=user_request_dto.email,
        password=hash_password(user_request_dto.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return ApiResponse(status="success", message="User created successfully", data={"user": UserResponseDto.model_validate(new_user)})

# Login and get a token
@user_router.post("/login")
def login(login_request_dto: LoginRequestDto, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_request_dto.email).first()

    if not user or not verify_password(login_request_dto.password, user.password):
        return ApiResponse(
            status="error",
            message="Invalid email or password",
            data=None
        )

    token = create_access_token(data={"sub": str(user.id)})

    return ApiResponse(
        status="success",
        message="Login successful",
        data={"access_token": token, "token_type": "bearer"}
    )

# Get the currently logged-in user's details
@user_router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    # Return the authenticated user's details
    return ApiResponse(
        status="success",
        message="User details fetched successfully",
        data={
            "user": UserResponseDto.model_validate(current_user)
        }
    )