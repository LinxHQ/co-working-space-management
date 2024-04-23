Environment File `.env` sample:

```commandline
APPLICATION_URL="http://127.0.0.1:8000"
DATABASE_URL="mysql://root:root@127.0.0.1:8889/..."
SECRET_KEY="your-secret-key"
ACCESS_TOKEN_ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=120
OPENAI_API_KEY="ebebe=..."
```

## Install packages:

**DO NOT** use the virtual enviroment `venv` in the folder. Delete and create a new one.

Mac M1/M2 chip: https://bephongviet.com/python-ket-noi-voi-mysql-tren-may-mac-dung-chip-m1-m2-_mysql_affected_rows-error/

```commandline
Create venv:
python86 python3 -m venv venv
. venv/bin/activate
```

```commandline
python86 python3 -m pip install --no-cache-dir --force-reinstall mysqlclient
python86 python3 -m pip install fastapi sqlalchemy alembic uvicorn python-dotenv 
```
## Migration command

```commandline
alembic revision --autogenerate -m "<describe changes>"
alembic upgrade head
```

## Run server

```commandline
uvicorn main:app --reload
```
