# File path: my_api/routers/rental_routers.py
import sys

from fastapi import APIRouter, Depends, HTTPException, Path, Query, status
from sqlalchemy.orm import Session
from typing import Any, List, Optional
from datetime import datetime
import logging
from dotenv import dotenv_values

from models.rental_model import Rental
from schemas.rental_schema import RentalView, RentalCreate, RentalSearch, RentalEdit
from schemas.default_schema import PaginatedResponse
from database import Base, SessionLocal, get_db, engine
from utils.default_auth_utils import validate_access_token

# Load .env configuration
config = dotenv_values(".env")
logger = logging.getLogger(__name__)
logger_handler = logging.StreamHandler(sys.stdout)
logger_formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s', datefmt='%Y-%m-%d %H:%M:%S')
logger_handler.setFormatter(logger_formatter)
logger.setLevel(logging.DEBUG)

# Create tables
Base.metadata.create_all(bind=engine)

# Initiate a new API router
router = APIRouter()

# Other endpoints omitted for brevity...

@router.get('/rentals/search', response_model=PaginatedResponse[RentalView], summary='Search rentals with filters')
def search_rentals(
        start_date: Optional[datetime] = Query(None, description='Start date filter'),
        end_date: Optional[datetime] = Query(None, description='End date filter'),
        db: Session = Depends(get_db),
        skip: int = Query(0, alias='skip'),
        limit: int = Query(10, alias='limit'),
        token_data: str = Depends(validate_access_token)
) -> Any:
    logger = logging.getLogger("rentals.search")
    logger.info("Search rentals endpoint called")
    logger.debug(f"Parameters Received - start_date: {start_date}, end_date: {end_date}, skip: {skip}, limit: {limit}")

    query = db.query(Rental)
    if start_date:
        query = query.filter(Rental.start_date >= start_date)
        logger.debug(f"Filtering by start_date: {start_date}")
    if end_date:
        query = query.filter(Rental.end_date <= end_date)
        logger.debug(f"Filtering by end_date: {end_date}")

    total_records = query.count()
    records = query.offset(skip).limit(limit).all()
    total_pages = total_records // limit + (1 if total_records % limit > 0 else 0)  # Calculate total pages

    if not records:
        logger.warning("No rentals found")
        raise HTTPException(status_code=404, detail='No rentals found')

    logger.info(f"Returning {len(records)} of {total_records} total rental records")
    return {'total_records': total_records, 'total_pages': total_pages, 'records': records}


@router.post("/rentals/", response_model=RentalView)
def create_rental(rental: RentalCreate, db: Session = Depends(get_db)
                  , token_data: str = Depends(validate_access_token)):
    db_rental = Rental(**rental.dict())
    db.add(db_rental)
    db.commit()
    db.refresh(db_rental)
    return db_rental


@router.get("/rentals/{rental_id}", response_model=RentalView)
def read_rental(rental_id: str, db: Session = Depends(get_db)
                , token_data: str = Depends(validate_access_token)):
    db_rental = db.query(Rental).filter(Rental.id == rental_id).first()
    if db_rental is None:
        raise HTTPException(status_code=404, detail="Rental not found")
    return db_rental


@router.put("/rentals/{rental_id}", response_model=RentalView)
def update_rental(rental_id: str, rental: RentalEdit, db: Session = Depends(get_db)
                  , token_data: str = Depends(validate_access_token)):
    db_rental = db.query(Rental).filter(Rental.id == rental_id).first()
    if db_rental:
        update_data = rental.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_rental, key, value)
        db.commit()
        db.refresh(db_rental)

    return db_rental


@router.delete("/rentals/{rental_id}")
def delete_rental(rental_id: str, db: Session = Depends(get_db)
                  , token_data: str = Depends(validate_access_token)):
    db_rental = db.query(Rental).filter(Rental.id == rental_id).first()
    if db_rental is None:
        raise HTTPException(status_code=404, detail="Rental not found")

    if db_rental:
        db.delete(db_rental)
        db.commit()

    return {'message': 'Space deleted successfully.'}

