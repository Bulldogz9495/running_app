import os

DBHOST = os.environ.get('DBHOST')
DBPORT = os.environ.get('DBPORT')
DATABASE_URL = f"mongodb+srv://{DBHOST}:{DBPORT}/"
DATABASE_NAME = "running_data"
LOCALDEV = True
JWT_EXPIRATION_TIME_MINUTES = 5



import logging
def setup_logger():
    # Configure root logger
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
    
    # Get the root logger
    logger = logging.getLogger()
    return logger

# Initialize the logger
logger = setup_logger()
