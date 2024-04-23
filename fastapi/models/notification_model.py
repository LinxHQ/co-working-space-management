# File path: my_api/models/notification_model.py

from sqlalchemy import Column, String, Boolean, ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.dialects.mysql import TEXT
import uuid
from database import Base


class Notification(Base):
    __tablename__ = 'notifications'

    id = Column(String(60), primary_key=True, default=lambda: str(uuid.uuid4()), unique=True)
    user_id = Column(String(60), ForeignKey('users.id'), nullable=False)
    message = Column(TEXT)
    read_status = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP, server_default=func.now())

    user = relationship('User')

    def __repr__(self):
        return f'<Notification id={self.id} user_id={self.user_id} message={self.message[:20]} read_status={self.read_status}>'