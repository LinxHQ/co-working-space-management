# File path: my_api/models/rental_model.py
from sqlalchemy import Column, String, DateTime, DECIMAL, Text, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
import uuid
from sqlalchemy.sql import text
from sqlalchemy.sql.functions import now


class Rental(Base):
    __tablename__ = 'rentals'

    id = Column(String(60), primary_key=True, default=lambda: str(uuid.uuid4()), unique=True)
    user_id = Column(String(60), ForeignKey('users.id'), nullable=False)
    space_id = Column(String(60), ForeignKey('spaces.id'), nullable=False)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=True)
    monthly_fee = Column(DECIMAL(10, 2), nullable=False)
    special_remarks = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))
    
    user = relationship('User')
    space = relationship('Space')
    payments = relationship('Payment')

    def __repr__(self):
        return f"<Rental(id='{self.id}', user_id='{self.user_id}', space_id='{self.space_id}', monthly_fee='{self.monthly_fee}')>"