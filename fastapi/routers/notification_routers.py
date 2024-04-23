import sys

from fastapi import APIRouter, HTTPException, status, Depends, Path, Query
from sqlalchemy.orm import Session
from typing import List, Optional, Any
from datetime import datetime
from models.notification_model import Notification
from schemas.notification_schema import NotificationCreate, NotificationView, NotificationEdit
from schemas.default_schema import PaginatedResponse
from database import Base, SessionLocal, get_db
from utils.default_auth_utils import validate_access_token
import logging
from dotenv import dotenv_values

config = dotenv_values(".env")
logger = logging.getLogger(__name__)
logger_handler = logging.StreamHandler(sys.stdout)
logger_formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s', datefmt='%Y-%m-%d %H:%M:%S')
logger_handler.setFormatter(logger_formatter)
logger.setLevel(logging.DEBUG)

router = APIRouter(prefix="/notifications", tags=["notifications"], responses={404: {"description": "Not found"}})


@router.post("/", response_model=NotificationView, status_code=status.HTTP_201_CREATED)
def create_notification(notification_create: NotificationCreate, db: Session = Depends(get_db)
                        , token_data: str = Depends(validate_access_token)):
    logging.info("Creating a new notification")
    # ... Create notification code ...
    logging.info("Notification created successfully")
    return new_notification


@router.get('/search', response_model=PaginatedResponse[NotificationView])
def get_notifications_search(user_id: str, read_status: bool, db: Session = Depends(get_db),
                             skip: int = Query(0, alias='skip'),
                             limit: int = Query(10, alias='limit'),
                             token_data: str = Depends(validate_access_token)) -> PaginatedResponse[NotificationView]:
    logging.info(f"Searching notifications for user_id: {user_id} with read_status: {read_status}")
    query = db.query(Notification).filter(Notification.user_id == user_id, Notification.read_status == read_status)
    total_records = query.count()
    logging.debug("Total records found: %d", total_records)
    records = query.offset(skip).limit(limit).all()
    total_pages = total_records // limit + (1 if total_records % limit > 0 else 0)
    logging.info("Search completed successfully")
    return PaginatedResponse(total_records=total_records, total_pages=total_pages, records=records)
