# File path: my_api/routers/default_auth_routers.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from models.user_model import User
from schemas.user_create_schema import UserCreate
from schemas.user_read_schema import UserRead
from database import Base, SessionLocal, get_db
from utils.default_auth_utils import is_safe_password, is_valid_email, Token, generate_safe_password
from jose import JWTError, jwt
from itsdangerous import URLSafeTimedSerializer, SignatureExpired
from google.oauth2 import id_token
from google.auth.transport import requests
from dotenv import dotenv_values
from datetime import datetime, timedelta
from typing import Optional

env = dotenv_values(".env")
GOOGLE_CLIENT_ID = env.get('GOOGLE_CLIENT_ID', 'google-id...')

router = APIRouter(
    prefix="/default-auth",
    tags=["auth"],
    responses={404: {"description": "Not found"}},
)

# Prepare the password hasher
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/accounts/authenticate")

ACCESS_TOKEN_EXPIRE_MINUTES = 60*24*7
ACCESS_TOKEN_ALGORITHM = "HS256"
SECRET_KEY = "Mkj0893-35STNp23JBRorh9ibqlnutd8057qcnyvnpryt-459845.ere232"


@router.post("/register", response_model=UserRead)
async def register(account: UserCreate, db: Session = Depends(get_db)):
    # First, check if the user already exists:
    db_user = db.query(User).filter(User.email == account.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # check if email is valid
    if not is_valid_email(account.email):
        raise HTTPException(status_code=400, detail="Email is invalid.")

    # check if password is safe
    if not is_safe_password(account.password):
        raise HTTPException(status_code=400,
                            detail="Safe password must have at least 8 characters, at least 1 upper case, " \
                                   "1 lower case, 1 digit and 1 special symbol. " \
                                   "And it must not contain any known word in the English dictionary.")

    return create_account(account, db)


@router.post("/authenticate", response_model=Token)
def authenticate_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    account_from_db = authenticate_account(db, form_data.username, form_data.password)
    if not account_from_db:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    access_token_expires = timedelta(minutes=int(ACCESS_TOKEN_EXPIRE_MINUTES))
    access_token = create_access_token(
        data={"sub": form_data.username, "userid": account_from_db.id}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer",
            "email": account_from_db.email, "userid": account_from_db.id,
            "is_admin": account_from_db.is_admin}


@router.post("/auth/google", response_model=Token)
async def google_auth(token: str, db: Session = Depends(get_db)):
    try:
        # Verify the token
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), GOOGLE_CLIENT_ID)

        user_email = idinfo['email']
        user_name = idinfo.get('name')

        user_data = UserCreate(email=user_email, name=user_name, password=generate_safe_password())
        user = get_or_create_user(user_data, db)

        # Create a JWT token as part of the authentication process
        access_token_expires = timedelta(minutes=60)
        access_token = create_access_token(data={"sub": user.email}, expires_delta=access_token_expires)

        return {"access_token": access_token, "token_type": "bearer"}
    except ValueError:
        # Invalid token
        raise HTTPException(status_code=400, detail="Invalid token")


# Helpers and utility functions

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_account(email: str, db: Session) -> Optional["User"]:
    return db.query(User).filter(User.username == email).first()


def create_account(account, db):
    # Hash the password
    hashed_password = pwd_context.hash(account.password)

    # Store the account in the database
    db_account = User(
        username=account.email,
        email=account.email,
        password_hash=hashed_password,
        is_admin=False
    )
    db.add(db_account)
    db.commit()
    db.refresh(db_account)
    return db_account


def get_or_create_user(user_data: User, db) -> User:
    # Placeholder for your database logic
    # This should check if the user exists in your DB and return it,
    # or create a new user entry in your DB and then return it.
    user = get_account(user_data.email, db)
    if user is None:
        user = create_account(user_data, db)
    return user  # This is a simplification.


def authenticate_account(db: Session, email: str, password: str):
    account = get_account(email, db)
    if not account:
        return False
    if not verify_password(password, account.password_hash):
        return False
    return account


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ACCESS_TOKEN_ALGORITHM)
    return encoded_jwt
