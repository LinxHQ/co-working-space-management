# File path: my_api/schemas/user_update_schema.py

from typing import Optional
from pydantic import BaseModel


class UserUpdate(BaseModel):
    id: str
    name: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None

    class Config:
        orm_mode = True
