from motor.motor_asyncio import AsyncIOMotorClient
from app.settings import DATABASE_URL, DATABASE_NAME, logger, DBPORT, DBHOST, ENVIRONMENT
import pymongo


class MongoDBService:
    def __init__(self):
        if ENVIRONMENT == 'local':
            self.sync_client = pymongo.MongoClient(DBHOST, int(DBPORT))
            self.client = AsyncIOMotorClient(DBHOST, int(DBPORT))
        else:
            self.sync_client = pymongo.MongoClient(DATABASE_URL)
            self.client = AsyncIOMotorClient(DATABASE_URL)
        self.sync_db = self.sync_client[DATABASE_NAME]
        self.db = self.client[DATABASE_NAME]

    
    
    