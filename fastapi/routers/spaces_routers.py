import sys

from fastapi import APIRouter, HTTPException, Depends, Body, Path, Query, File, Form, UploadFile
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List, Optional, Any
from database import SessionLocal, engine, get_db
from models.space_model import Space
from schemas.space_schema import SpaceCreate, SpaceView, SpaceEdit, SpaceType, FeeType
from schemas.default_schema import PaginatedResponse
import logging
from dotenv import dotenv_values
import hashlib
import uuid
from utils.default_auth_utils import validate_access_token

config = dotenv_values(".env")
logger = logging.getLogger(__name__)
logger_handler = logging.StreamHandler(sys.stdout)
logger_formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s', datefmt='%Y-%m-%d %H:%M:%S')
logger_handler.setFormatter(logger_formatter)
logger.setLevel(logging.DEBUG)

router = APIRouter()


@router.post('/spaces', response_model=SpaceView)
async def create_space(
    name: str = Form(...),
    type: SpaceType = Form(...),
    description: str = Form(...),
    fee: float = Form(...),
    fee_type: FeeType = Form(...),
    photos: List[UploadFile] = File([]),
    db: Session = Depends(get_db), token_data: str = Depends(validate_access_token)):
    logger.info('Creating a new space')
    photo_urls = []

    for photo in photos:
        # Here you would save each photo to a file system or cloud storage
        # Generate or obtain a URL for each photo
        photo_path = f'{photo.filename}-' + unique_filename_from_file(photo.filename)
        write_photo(photo.file, photo_path)
        photo_urls.append(photo_path)

    new_space = Space(
        name=name,
        type=type,
        description=description,
        photos=photo_urls,  # Assuming you're storing URLs or paths to the photos
        fee=fee,
        fee_type=fee_type
    )

    try:
        db.add(new_space)
        db.commit()
        db.refresh(new_space)
        logger.info(f'New space created with ID: {new_space.id}')
        return new_space
    except IntegrityError:
        db.rollback()
        logger.exception('IntegrityError when creating a space with name:', name)
        raise HTTPException(status_code=400, detail="Space with this name already exists.")


def unique_filename_from_file(file_name):
    # Hash the original file name to get a consistent base
    hasher = hashlib.sha256()
    hasher.update(file_name.encode('utf-8'))
    hashed_name = hasher.hexdigest()

    # Generate a unique UUID
    unique_suffix = uuid.uuid4().hex

    # Combine both to get a unique and derived file name
    unique_file_name = f"{hashed_name}_{unique_suffix}"
    return unique_file_name


def write_photo(file, path):
    with open(f"uploads/{path}", 'wb') as buffer:
        data = file.read()
        buffer.write(data)


@router.get('/spaces/{space_id}', response_model=SpaceView)
def get_space(
    space_id: str = Path(..., description="The ID of the space to retrieve"),
    db: Session = Depends(get_db), token_data: str = Depends(validate_access_token)
):
    logger.info('Fetching space with ID: %s', space_id)
    space = db.query(Space).filter(Space.id == space_id).first()

    if space is None:
        logger.warning('Space with ID: %s not found', space_id)
        raise HTTPException(status_code=404, detail="Space not found")
    return space


@router.get('/spaces', response_model=PaginatedResponse[SpaceView])
def get_spaces(
        type: Optional[str] = None,
        availability: Optional[str] = None,
        db: Session = Depends(get_db),
        skip: int = Query(0, alias='skip'),
        limit: int = Query(20, alias='limit'), token_data: str = Depends(validate_access_token)
    ):
    logger.info('Fetching spaces')
    query = db.query(Space)
    if type:
        query = query.filter(Space.type == type)
    if availability:
        pass
    total_records = query.count()
    spaces = query.offset(skip).limit(limit).all()
    total_pages = total_records // limit + (1 if total_records % limit > 0 else 0)
    return {'total_records': total_records, 'total_pages': total_pages, 'records': spaces}


@router.put('/spaces/{space_id}', response_model=SpaceView)
def update_space(
        space_id: str = Path(..., description="The ID of the space to update"),
        space_update: SpaceEdit = Body(...),
        db: Session = Depends(get_db), token_data: str = Depends(validate_access_token)
):
    logger.info('Updating space with ID: %s', space_id)
    db_space = db.query(Space).filter(Space.id == space_id).first()

    if db_space is None:
        logger.warning('Space with ID: %s not found for update', space_id)
        raise HTTPException(status_code=404, detail="Space not found")

    space_update_data = space_update.dict(exclude_unset=True)
    for key, value in space_update_data.items():
        setattr(db_space, key, value)
    db.commit()
    logger.info('Space with ID: %s updated successfully', space_id)
    return db_space


@router.delete('/spaces/{space_id}', response_model=dict)
def delete_space(
    space_id: str = Path(..., description='The ID of the space to be deleted'),
    db: Session = Depends(get_db), token_data: str = Depends(validate_access_token)
) -> Any:
    logger.info('Deleting space with ID: %s', space_id)
    space = db.query(Space).filter(Space.id == space_id).first()
    if not space:
        logger.warning('Space with ID: %s not found for deletion', space_id)
        raise HTTPException(status_code=404, detail='Space not found')

    db.delete(space)
    db.commit()
    logger.info('Space with ID: %s deleted successfully', space_id)
    return {'message': 'Space deleted successfully.'}

