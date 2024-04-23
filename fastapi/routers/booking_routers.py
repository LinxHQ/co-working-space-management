import enum
import sys

from fastapi import APIRouter, Depends, HTTPException, Path, Body, Query, status
from sqlalchemy.orm import Session
from typing import List
from database import SessionLocal, get_db
from models.booking_model import Booking
from schemas.booking_schema import BookingCreate, BookingView, BookingEdit, BookingStatus
from schemas.default_schema import PaginatedResponse
from dotenv import dotenv_values
from utils.default_auth_utils import validate_access_token

import logging

# Load logging level from .env file
config = dotenv_values(".env")
logger = logging.getLogger(__name__)
logger_handler = logging.StreamHandler(sys.stdout)
logger_formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s', datefmt='%Y-%m-%d %H:%M:%S')
logger_handler.setFormatter(logger_formatter)
logger.setLevel(logging.DEBUG)

router = APIRouter(
    prefix="/bookings",
    tags=["bookings"],
    responses={404: {"description": "Not found"}},
)

@router.post('/', response_model=BookingView, status_code=status.HTTP_201_CREATED)
def create_booking(booking: BookingCreate, db: Session = Depends(get_db),
                   token_data: str = Depends(validate_access_token)):
    logging.info("Creating a new booking")
    new_booking = Booking(
        user_id=booking.user_id,
        space_id=booking.space_id,
        start_date=booking.start_date,
        end_date=booking.end_date,
        status=booking.status,
        # amount_paid=booking.amount_paid,
        special_remarks=booking.special_remarks
    )
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    logging.info("Booking created successfully")
    return new_booking


@router.get('/{booking_id}', response_model=BookingView)
def get_booking(booking_id: str, db: Session = Depends(get_db), token_data: str = Depends(validate_access_token)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if booking is None:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking


@router.get('/', response_model=PaginatedResponse[BookingView])
def get_bookings(db: Session = Depends(get_db), skip: int = Query(0, alias='skip'),
                 limit: int = Query(10, alias='limit'), token_data: str = Depends(validate_access_token)):
    logging.info("Getting list of bookings with skip=%s, limit=%s", skip, limit)
    query = db.query(Booking)
    total_records = query.count()
    # If you have additional filter, apply them before counting and slicing
    records = query.offset(skip).limit(limit).all()
    total_pages = total_records // limit + (1 if total_records % limit > 0 else 0)  # Calculate total pages
    logging.info("Total records: %s, Total pages: %s", total_records, total_pages)
    return {'total_records': total_records, 'total_pages': total_pages, 'records': records}


@router.put('/{booking_id}', response_model=BookingView)
def update_booking(booking_id: str, booking: BookingEdit, db: Session = Depends(get_db),
                   token_data: str = Depends(validate_access_token)):
    db_booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if db_booking is None:
        raise HTTPException(status_code=404, detail="Booking not found")
    for var, value in vars(booking).items():
        setattr(db_booking, var, value) if value else None
    db.commit()
    db.refresh(db_booking)
    return db_booking


@router.delete('/{booking_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_booking(booking_id: str, db: Session = Depends(get_db), token_data: str = Depends(validate_access_token)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if booking is None:
        raise HTTPException(status_code=404, detail="Booking not found")
    db.delete(booking)
    db.commit()
    return {'message': 'Booking deleted successfully.'}


@router.get('/user/{user_id}', response_model=PaginatedResponse[BookingView])
def get_user_bookings(user_id: str, db: Session = Depends(get_db), token_data: str = Depends(validate_access_token)
                      , skip: int = Query(0, alias='skip'), limit: int = Query(10, alias='limit')):
    if token_data.userid != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access to the requested booking is forbidden")
    query = db.query(Booking)
    total_records = query.count()
    records = query.filter(Booking.user_id == user_id).offset(skip).limit(limit).all()
    total_pages = total_records // limit + (1 if total_records % limit > 0 else 0)  # Calculate total pages
    if not records:
        raise HTTPException(status_code=404, detail="No bookings found for the user")
    response = PaginatedResponse(
        total_records=total_records,
        total_pages=total_pages,
        records=records
    )
    return response
