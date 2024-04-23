# File path: my_api/schemas/rental_schema.py

from pydantic import BaseModel, constr, Json, Field, validator
from typing import Optional, List, Dict, Union
from datetime import datetime
from enum import Enum
from schemas.user_read_schema import UserRead
from schemas.space_schema import SpaceView


class SpaceType(str, Enum):
    common_area = 'common_area'
    private_office = 'private_office'
    photo_studio = 'photo_studio'
    event_space = 'event_space'


class FeeType(str, Enum):
    hourly = 'hourly'
    daily = 'daily'
    monthly = 'monthly'


class RentalCreate(BaseModel):
    user_id: constr(max_length=60)
    space_id: constr(max_length=60)
    start_date: datetime
    end_date: datetime
    monthly_fee: float
    special_remarks: Optional[str]

    class Config:
        orm_mode = True


class RentalView(BaseModel):
    """Schema for viewing a rental details."""
    id: str
    user_id: str
    space_id: str
    start_date: datetime
    end_date: datetime
    monthly_fee: float
    special_remarks: Optional[str] = None
    created_at: datetime

    user: UserRead
    space: SpaceView

    # Enable orm_mode to allow the model instance to read data from an ORM model (e.g., SQLAlchmey model)
    class Config:
        orm_mode = True


class RentalEdit(BaseModel):
    """Schema for editing an existing rental."""
    user_id: Optional[str] = Field(None, max_length=60)
    space_id: Optional[str] = Field(None, max_length=60)
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    monthly_fee: Optional[float] = Field(None, gt=0)
    special_remarks: Optional[str] = None
    
    @validator('user_id', 'space_id')
    def validate_id(cls, v):
        if v is not None and not v.strip():
            raise ValueError('This field cannot be blank')
        return v
    
    class Config:
        orm_mode = True


class RentalSearch(BaseModel):
    name: constr(max_length=255)
    type: List[str]  # Simplified to List for sake of example
    description: str
    photos: Json
    fee: float  # Keep the Decimal type for consistency with others
    fee_type: FeeType  # Use enum instead of regex validation
    created_at: datetime

    class Config:
        orm_mode = True

    # Include additional fields or methods if required

    # Please note this is a simplified model schema for the given task,
    # expand upon it according to your application's needs, including validation,
    # and potentially other Pydantic features like Field with description etc.