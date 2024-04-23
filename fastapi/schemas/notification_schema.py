# File path: my_api/schemas/notification_schema.py

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID


class NotificationBase(BaseModel):
    message: str
    read_status: bool

    class Config:
        orm_mode = True


class NotificationCreate(NotificationBase):
    user_id: str = Field(..., description="Reference to the user who will receive the notification.")


class NotificationView(NotificationBase):
    id: UUID
    user_id: UUID
    created_at: Optional[datetime]

    class Config:
        orm_mode = True


class NotificationEdit(BaseModel):
    user_id: Optional[str] = Field(None, description="ID of the user")
    message: Optional[str] = Field(None, description="Notification message text")
    read_status: Optional[bool] = Field(None, description="Read status of the notification")

    class Config:
        orm_mode = True
