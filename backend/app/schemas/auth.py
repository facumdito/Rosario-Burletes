from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str = ""
    tenant_name: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    tenant_id: int
    user_id: int
    email: str


class UserOut(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    tenant_id: int

    class Config:
        from_attributes = True
