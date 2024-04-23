# File path: my_api/models/user_model.py
import uuid
from sqlalchemy import Column, String, TIMESTAMP, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func, text
from database import Base
from sqlalchemy.orm import Session
from typing import Optional


class User(Base):
    __tablename__ = 'users'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), unique=True)
    username = Column(String(100))
    email = Column(String(100), unique=True)
    password_hash = Column(String(100))
    is_admin = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP, server_default=text('CURRENT_TIMESTAMP'))

    def __repr__(self):
        return f"<User(id='{self.id}', name='{self.username}', email='{self.email}')>"

    @staticmethod
    def get_account(db: Session, email: str) -> Optional["User"]:
        return db.query(User).filter(User.email == email).first()