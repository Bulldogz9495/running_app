from motor.motor_asyncio import AsyncIOMotorClient
from app.settings import DATABASE_NAME, logger, DBPORT, DBHOST, ENVIRONMENT, DATABASE_USER, DATABASE_PASSWORD, TOKEN_REFRESH_TIME
import pymongo
from pymongo.server_api import ServerApi
import boto3
import asyncio
from urllib.parse import quote_plus


class MongoDBService:
    def __init__(self):
        self.database_url = self.setupDatabaseUrl()
        self.sync_client = pymongo.MongoClient(self.database_url, server_api=ServerApi('1'))
        self.client = AsyncIOMotorClient(self.database_url, server_api=ServerApi('1'))
        self.sync_db = self.sync_client[DATABASE_NAME]
        self.db = self.client[DATABASE_NAME]
        self._task = asyncio.ensure_future(self._background_task())
        
    def __del__(self):
        self.sync_client.close()
        self.client.close()
        self.sync_db.close()
        self.db.close()

    async def _background_task(self):
        while True:
            await asyncio.sleep(TOKEN_REFRESH_TIME)
            await self._run_background_task()

    async def _run_background_task(self):
        background_task = asyncio.create_task(self.background_mongo_token_refresh())


    def setupDatabaseUrl(self):
        if ENVIRONMENT == 'local':
            db_url = f"""mongodb+srv://{DATABASE_USER}:{DATABASE_PASSWORD}@cluster0.dku630t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"""
            # logger.info(f"Local Database URL: {db_url}")
            return db_url
        else:
            credentials=boto3.Session().get_credentials()
            db_url = f"""mongodb+srv://{DATABASE_USER}:{DATABASE_PASSWORD}@serverlessinstance0-pe-1.ytovzs1.mongodb.net/?retryWrites=true&w=majority&appName=ServerlessInstance0"""
            # logger.info(f"Production Database URL: {db_url}")
            return db_url
    
    
    async def background_mongo_token_refresh(self):
        self.database_url = self.setupDatabaseUrl()
        self.sync_client = pymongo.MongoClient(self.database_url, server_api=ServerApi('1'))
        self.client = AsyncIOMotorClient(self.database_url, server_api=ServerApi('1'))
