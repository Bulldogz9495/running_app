from motor.motor_asyncio import AsyncIOMotorClient
from app.settings import DATABASE_URL, DATABASE_NAME, logger, DBPORT, DBHOST, ENVIRONMENT
import pymongo
from pymongo.server_api import ServerApi


class MongoDBService:
    def __init__(self):
        self.sync_client = pymongo.MongoClient(DATABASE_URL, server_api=ServerApi('1'))
        self.client = AsyncIOMotorClient(DATABASE_URL, server_api=ServerApi('1'))
        self.sync_db = self.sync_client[DATABASE_NAME]
        self.db = self.client[DATABASE_NAME]
