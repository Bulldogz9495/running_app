from motor.motor_asyncio import AsyncIOMotorClient
from app.settings import DATABASE_URL, DATABASE_NAME, logger, DBPORT, DBHOST
import pymongo


class MongoDBService:
    def __init__(self):
        self.sync_client = pymongo.MongoClient(DBHOST, int(DBPORT))
        self.sync_db = self.sync_client[DATABASE_NAME]
        self.client = AsyncIOMotorClient(DBHOST, int(DBPORT))
        self.db = self.client[DATABASE_NAME]

    
    
    