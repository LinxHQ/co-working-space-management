# File path: my_api/models/space_model.py
from sqlalchemy import Column, String, Text, Enum, DECIMAL, TIMESTAMP, JSON, UUID
from sqlalchemy.sql import func
from database import Base
from schemas.space_schema import SpaceType, FeeType
import enum
import uuid


class Space(Base):
    __tablename__ = 'spaces'

    id = Column(String(60), primary_key=True, default=lambda: str(uuid.uuid4()), unique=True)
    name = Column(String(255), unique=True, nullable=False)
    type = Column(Enum(SpaceType), nullable=False)
    description = Column(Text)
    photos = Column(JSON)
    fee = Column(DECIMAL(10, 2))
    fee_type = Column(Enum(FeeType), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())

    def __repr__(self):
        return f"<Space(name='{self.name}', type='{self.type}', fee='{self.fee}', fee_type='{self.fee_type}')>"
