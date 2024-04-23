# File path: my_api/models/payments_model.py
from sqlalchemy import Column, DECIMAL, DateTime, Enum, ForeignKey, String
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid
from database import Base  # Assuming the existence of a database module with the Base class

class Payment(Base):
    __tablename__ = 'payments'

    id = Column(String(60), primary_key=True, default=lambda:str(uuid.uuid4()), unique=True)
    booking_id = Column(String(60), ForeignKey('bookings.id'), nullable=True)
    rental_id = Column(String(60), ForeignKey('rentals.id'), nullable=True)
    type = Column(Enum('booking', 'rental'))
    payment_date = Column(DateTime)
    payment_ref = Column(String(255))
    amount = Column(DECIMAL(10, 2))

    booking = relationship('Booking')
    rental = relationship('Rental')

    # Define any additional methods and properties as required

# Ensure to import and use the Payment model accordingly in your application.
