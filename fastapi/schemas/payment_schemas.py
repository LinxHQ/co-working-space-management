# File path: my_api/schemas/payment_schemas.py
from pydantic import BaseModel, constr, Field
from typing import Optional
from datetime import datetime
from enum import Enum
from decimal import Decimal

class PaymentType(str, Enum):
    BOOKING = 'booking'
    RENTAL = 'rental'


class PaymentCreate(BaseModel):
    """Schema for creating a new payment record"""
    booking_id: Optional[constr(max_length=60)]
    rental_id: Optional[constr(max_length=60)]
    type: PaymentType
    payment_date: datetime
    payment_ref: constr(max_length=255)
    amount: Decimal

    class Config:
        orm_mode = True


class PaymentView(BaseModel):
    """Schema to view payment details"""
    id: str
    booking_id: Optional[str] = Field(None, description='ID of the booking')
    rental_id: Optional[str] = Field(None, description='ID of the rental')
    type: PaymentType = Field(..., description='Type of payment')
    payment_date: datetime = Field(..., description='Date of the payment')
    payment_ref: str = Field(..., max_length=255, description='Payment reference info from transaction')
    amount: Decimal = Field(..., description='Amount paid')

    class Config:
        orm_mode = True

class PaymentEdit(PaymentView):

    class Config:
        orm_mode = True
