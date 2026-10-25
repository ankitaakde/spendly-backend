from pydantic import BaseModel, EmailStr


class UserRequestDto(BaseModel):
    user_name: str
    email: EmailStr
    password: str


class UserResponseDto(BaseModel):
    id: int
    user_name: str
    email: str

    class Config:
        from_attributes = True


class LoginRequestDto(BaseModel):
    email: EmailStr
    password: str