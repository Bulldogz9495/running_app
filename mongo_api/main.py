import pymongo
import time
from fastapi import FastAPI
from app.routes.api import router as api_router
from app.services.mongodb_service import MongoDBService
from app.services.mongodb_seed import initialize_database
from app.models import data_models

initialize_database(data_models)

db_service = MongoDBService()

app = FastAPI()

app.include_router(api_router)
