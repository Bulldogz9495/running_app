import os
import pymongo
import time
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.api import router as api_router
from app.services.mongodb_seed import initialize_database
from app.models import data_models
from app.settings import logger


initialize_database(data_models)

app = FastAPI()

origins = [
    "http://localhost:8081",  # Replace with your React Native app's origin
    "https://your-production-app.com",  # Add other allowed origins as needed
]

app.port = 80
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["*"],
)

app.include_router(api_router)
