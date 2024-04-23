from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import dotenv_values

app = FastAPI()
origins = [
    "http://localhost",
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

env = dotenv_values(".env")

from routers import default_auth_routers
app.include_router(default_auth_routers.router)

# routers import and api routes will be included belowfrom routers import services_router
from routers import payments_routers
app.include_router(payments_routers.router)
from routers import spaces_routers
app.include_router(spaces_routers.router)
from routers import booking_routers
app.include_router(booking_routers.router)
from routers import notification_routers
app.include_router(notification_routers.router)
from routers import rental_routers
app.include_router(rental_routers.router)
from routers import file_routers
app.include_router(file_routers.router)