import re
from random import random

from fastapi import Depends, HTTPException, status
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer
from typing import Optional
from pydantic import BaseModel
import enchant

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/default-auth/authenticate")
ACCESS_TOKEN_ALGORITHM = "HS256"
SECRET_KEY = "Mkj0893-35STNp23JBRorh9ibqlnutd8057qcnyvnpryt-459845.ere232"


class TokenData(BaseModel):
    email: Optional[str] = None
    userid: str


class Token(BaseModel):
    access_token: str
    token_type: str
    email: str
    userid: str


def validate_access_token(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ACCESS_TOKEN_ALGORITHM])
        email: str = payload.get("sub")
        userid: str = payload.get("userid")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email, userid=userid)
    except JWTError:
        raise credentials_exception
    return token_data


def is_valid_email(email):
    # Regular expression pattern for email validation
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'

    # Check if the email matches the pattern
    if re.match(pattern, email):
        return True
    else:
        return False


def is_safe_password(password):
    dictionary = enchant.Dict("en_US")  # Specify the language dictionary

    # Check if the password meets the required criteria
    if (
            len(password) >= 8 and
            re.search(r'[A-Z]', password) and
            re.search(r'[a-z]', password) and
            re.search(r'\d', password) and
            re.search(r'[^A-Za-z0-9]', password) and
            not any(word in password.lower() for word in dictionary.suggest(password.lower()))
    ):
        return True
    else:
        return False


def generate_safe_password(max_attempts=1000):
    dictionary = enchant.Dict("en_US")
    chars = {
        "lowercase": "abcdefghijklmnopqrstuvwxyz",
        "uppercase": "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        "digits": "0123456789",
        "special": "!@#$%^&*()-_=+"
    }

    for _ in range(max_attempts):
        # Build a random password
        password_list = [
            random.choice(chars["lowercase"]),
            random.choice(chars["uppercase"]),
            random.choice(chars["digits"]),
            random.choice(chars["special"])
        ]

        # Fill the rest to meet the minimum length requirement (and then some, for good measure)
        while len(password_list) < 12:
            char_type = random.choice(list(chars.keys()))
            password_list.append(random.choice(chars[char_type]))

        # Shuffle to ensure randomness
        random.shuffle(password_list)
        password = ''.join(password_list)

        # Check if the generated password meets the criteria
        if (
                len(password) >= 8 and
                re.search(r'[A-Z]', password) and
                re.search(r'[a-z]', password) and
                re.search(r'\d', password) and
                re.search(r'[^A-Za-z0-9]', password) and
                not any(dictionary.check(word) or dictionary.check(word.capitalize()) for word in
                        re.findall(r'\w+', password))
        ):
            return password

    raise Exception("Failed to generate a safe password after multiple attempts.")

