import os
import dotenv


dotenv.load_dotenv()

DBHOST = os.environ.get('DBHOST', default="mongodb")
DBPORT = os.environ.get('DBPORT', default=27017)
ENVIRONMENT= os.environ.get('ENVIRONMENT')
DATABASE_URL = f"""mongodb+srv://{os.environ.get("DATABASE_USER")}:{os.environ.get("DATABASE_PASSWORD")}@cluster0.dku630t.mongodb.net/"""
DATABASE_NAME = "running_data"
JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY")
LOCALDEV = True
JWT_EXPIRATION_TIME_MINUTES = 5
JWT_ALGORITHM = "HS256"


import logging
def setup_logger():
    # Configure root logger
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
    
    # Get the root logger
    logger = logging.getLogger()
    return logger

# Initialize the logger
logger = setup_logger()
