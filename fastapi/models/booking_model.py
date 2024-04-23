# File path: my_api/models/booking_model.py
from sqlalchemy import Column, String, Enum, ForeignKey, Text, DateTime, DECIMAL
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from database import Base


# Represents a booking record with user, space, and period details.
class Booking(Base):
    __tablename__ = 'bookings'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), unique=True)
    user_id = Column(String(60), ForeignKey('users.id'))
    space_id = Column(String(60), ForeignKey('spaces.id'))
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    status = Column(Enum('cancelled', 'active'), default='active')
    #amount_paid = Column(DECIMAL(10, 2))
    special_remarks = Column(Text)
    created_at = Column(DateTime, server_default=func.now())

    # Define the relationship to User and Space
    user = relationship('User')
    space = relationship('Space')
    payments = relationship('Payment')

    def __repr__(self):
        return f"<Booking(id='{self.id}', status='{self.status}')>"