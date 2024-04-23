# File path: my_api/schemas/space_schema.py
from pydantic import BaseModel, Field, constr, Json
from typing import Optional, List
from enum import Enum
from datetime import datetime
import json


class SpaceType(str, Enum):
    common_area = 'common_area'
    private_office = 'private_office'
    photo_studio = 'photo_studio'
    event_space = 'event_space'


class FeeType(str, Enum):
    hourly = 'hourly'
    daily = 'daily'
    monthly = 'monthly'


class SpaceCreate(BaseModel):
    name: constr(max_length=255)
    type: SpaceType
    description: Optional[str]
    photos: Optional[str]   # now correctly using Pydantic Json type
    fee: float
    fee_type: FeeType

    class Config:
        orm_mode = True


class SpaceView(BaseModel):
    id: str
    name: str = Field(..., max_length=255)
    type: SpaceType
    description: Optional[str]
    photos: Optional[List[str]]   # kept this as it provides a clear idea that 'photos' must be decoded from JSON
    fee: float 
    fee_type: FeeType
    created_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class SpaceEdit(SpaceView):

    class Config:
        orm_mode = True
