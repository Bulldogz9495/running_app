from app.settings import DATABASE_URL, DATABASE_NAME, logger, DBHOST, DBPORT
import pymongo
from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError, ConnectionFailure
from app.models import data_schemas, data_seed
from app.settings import DATABASE_URL, ENVIRONMENT

def initialize_database(collections):
    wait_for_server()
    create_database()

def create_database():
    try:
        # Connect to MongoDB server
        logger.info(f"Connecting: DBURL: {DATABASE_URL}")
        client = MongoClient(DATABASE_URL)
        db = client[DATABASE_NAME]
        
        # Create collections with their respective schemas
        for collection_name, schema in data_schemas.items():
            if collection_name not in db.list_collection_names():
                db.create_collection(collection_name)
                logger.info(f"Collection '{collection_name}' created.")
                if ENVIRONMENT == "local":
                    seed_collection(db, collection_name, data_seed[collection_name])
                    logger.info(f"Collection '{collection_name}' seeded.")
            else:
                logger.info(f"Collection '{collection_name}' already exists.")
    
        logger.info("Database initialized successfully!")
        client.close()
    except ServerSelectionTimeoutError as e:
        logger.error(f"Error: Connection to MongoDB server timed out. \n{e}")
        client.close()
 
def wait_for_server():
    connection = False
    while not connection:
        try:
            logger.info(f"Connecting: DBURL: {DATABASE_URL}")
            client = MongoClient(DATABASE_URL)
            # Use any database command to check the server status
            server_info = client.server_info()
            connection = True
            logger.info(f"MongoDB server is running: {server_info['version']}")
        except ConnectionFailure as e:
            logger.error(f"Failed to connect to MongoDB server. Check if the server is running. \n{e}")
        except Exception as e:
            logger.error(f"An error occurred: {e}")
        finally:
            # Close the connection if it was opened
            if 'client' in locals():
                client.close()


def seed_collection(db, collection, data):
    for d in data:
        try:
            db[collection].insert_one(d)
        except Exception as e:
            logger.error(f"Error seeding data: {e}")
    logger.info("Seeding Database Complete")