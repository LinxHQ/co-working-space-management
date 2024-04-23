# File path: my_api/schemas/booking_schema.py
from datetime import datetime
from pydantic import BaseModel, Field, validator, condecimal
from typing import Optional, List, Union, Any
from enum import Enum
from schemas.space_schema import SpaceView
from schemas.user_read_schema import UserRead
from schemas.payment_schemas import PaymentView

# Enum classes
class SpaceType(str, Enum):
    common_area = 'common_area'
    private_office = 'private_office'
    photo_studio = 'photo_studio'
    event_space = 'event_space'


class FeeType(str, Enum):
    hourly = 'hourly'
    daily = 'daily'
    monthly = 'monthly'


class BookingStatus(str, Enum):
    cancelled = 'cancelled'
    active = 'active'


class PaymentType(str, Enum):
    booking = 'booking'
    rental = 'rental'


# Pydantic schemas
class BookingBase(BaseModel):
    user_id: str
    space_id: str
    start_date: datetime
    end_date: Optional[datetime] = None
    status: BookingStatus
    # amount_paid: float
    special_remarks: Optional[str] = None

    class Config:
        orm_mode = True


class BookingCreate(BookingBase):
    pass


class BookingView(BookingBase):
    id: str
    space: SpaceView
    user: UserRead
    payments: List[PaymentView]

    class Config:
        orm_mode = True


class BookingEdit(BaseModel):
    user_id: Optional[str] = Field(None, max_length=60)
    space_id: Optional[str] = Field(None, max_length=60)
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    status: Optional[BookingStatus]
    # amount_paid: Optional[float] = None
    special_remarks: Optional[str] = None

    class Config:
        orm_mode = True


class BookingSearch(BaseModel):
    user_id: Optional[str]
    space_id: Optional[str]
    start_date: Optional[datetime]
    end_date: Optional[datetime]
    status: Optional[BookingStatus]
    # amount_paid: Optional[condecimal(max_digits=10, decimal_places=2)]
    special_remarks: Optional[str]

    class Config:
        orm_mode = True
