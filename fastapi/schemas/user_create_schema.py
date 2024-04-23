# File path: my_api/schemas/user_create_schema.py
from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    """
    Schema for creating a new user.
    """
    username: Optional[str]
    email: EmailStr
    password: str

    class Config:
        orm_mode = True
