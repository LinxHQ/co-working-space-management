# File path: my_api/schemas/user_read_schema.py
from pydantic import BaseModel, EmailStr, constr
from typing import Optional
from datetime import datetime


class UserRead(BaseModel):
    id: constr(max_length=60)
    username: Optional[constr(max_length=100)]
    email: EmailStr
    password: Optional[constr(max_length=100)]
    created_at: datetime

    class Config:
        orm_mode = True
