import sys

from fastapi import APIRouter, HTTPException, Depends, status, Path, Body, Query
from sqlalchemy.orm import Session
from datetime import date
from typing import List, Optional, Any
from database import SessionLocal, engine, Base, get_db
from models.payments_model import Payment
from schemas.payment_schemas import PaymentView, PaymentCreate, PaymentEdit
from schemas.default_schema import PaginatedResponse
import logging
from dotenv import dotenv_values
from utils.default_auth_utils import validate_access_token

# Load .env file variables
config = dotenv_values(".env")
logger = logging.getLogger(__name__)
logger_handler = logging.StreamHandler(sys.stdout)
logger_formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s', datefmt='%Y-%m-%d %H:%M:%S')
logger_handler.setFormatter(logger_formatter)
logger.setLevel(logging.DEBUG)

Base.metadata.create_all(bind=engine)

router = APIRouter(tags=['Payments'])

@router.post('/payments', response_model=PaymentView)
def create_payment(payment: PaymentCreate, db: Session = Depends(get_db),
                   token_data: str = Depends(validate_access_token)):
    logging.info('Creating a new payment entry')
    new_payment = Payment(
        booking_id=payment.booking_id,
        rental_id=payment.rental_id,
        amount=payment.amount,
        payment_ref=payment.payment_ref,
        payment_date=payment.payment_date,
        type=payment.type,
    )
    db.add(new_payment)
    db.commit()
    db.refresh(new_payment)
    logging.info('Payment entry created successfully')
    return new_payment


@router.get('/payments', response_model=PaginatedResponse[PaymentView])
def list_payments(
    db: Session = Depends(get_db), 
    skip: int = Query(0, alias='skip'), 
    limit: int = Query(10, alias='limit'),
    token_data: str = Depends(validate_access_token)
):
    logging.info('Listing payments with pagination')
    query = db.query(Payment)
    total_records = query.count()
    records = query.offset(skip).limit(limit).all()
    total_pages = total_records // limit + (1 if total_records % limit > 0 else 0)
    logging.info('Payments listed successfully')
    return {'total_records': total_records, 'total_pages': total_pages, 'records': records}


@router.get('/payments/{payment_id}', response_model=PaymentView)
def get_payment(payment_id: str, db: Session = Depends(get_db), token_data: str = Depends(validate_access_token)):
    logging.info(f'Fetching payment with ID: {payment_id}')
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if payment:
        logging.info('Payment found')
        return payment
    else:
        logging.warning('Payment not found')
        raise HTTPException(status_code=404, detail="Payment not found")


@router.put('/payments/{payment_id}', response_model=PaymentView)
def update_payment(payment_id: str, payment_data: PaymentEdit, db: Session = Depends(get_db)
                   , token_data: str = Depends(validate_access_token)):
    logging.info(f'Updating payment with ID: {payment_id}')
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not payment:
        logging.warning('Payment not found for updating')
        raise HTTPException(status_code=404, detail="Payment not found")
    for var, value in vars(payment_data).items():
        setattr(payment, var, value) if value is not None else None
    db.commit()
    logging.info('Payment updated successfully')
    return payment


@router.delete('/payments/{payment_id}')
def delete_payment(payment_id: str, db: Session = Depends(get_db), token_data: str = Depends(validate_access_token)):
    logging.info(f'Deleting payment with ID: {payment_id}')
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if payment:
        db.delete(payment)
        db.commit()
        logging.info('Payment deleted successfully')
        return {"message": "Payment deleted successfully"}
    else:
        logging.warning('Payment not found for deletion')
        raise HTTPException(status_code=404, detail="Payment not found")
