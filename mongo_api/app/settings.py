import os, time
import logging
import dotenv
import boto3


def setup_logger():
    # Configure root logger
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
    
    # Get the root logger
    logger = logging.getLogger()
    return logger

# Initialize the logger
logger = setup_logger()


while "DATABASE_USER" not in os.environ:
    dotenv.load_dotenv()
    time.sleep(1)
    logger.info("Waiting 1 second for env variables")
    logger.info(os.environ)
DBHOST = os.environ.get('DBHOST', default="mongodb")
DBPORT = os.environ.get('DBPORT', default=27017)
ENVIRONMENT= os.environ.get('ENVIRONMENT')
if ENVIRONMENT == "local":
    DATABASE_URL = f"""mongodb+srv://{os.environ.get("DATABASE_USER")}:{os.environ.get("DATABASE_PASSWORD")}@cluster0.dku630t.mongodb.net/"""
else:
    sts_client = boto3.client('sts')
    assumed_role_object=sts_client.assume_role(
        RoleArn=os.environ.get("ROLE_ARN")
    )
    credentials=assumed_role_object['Credentials']
    DATABASE_URL = f"""mongodb+srv://{credentials['AccessKeyId']}:{credentials['SecretAccessKey']}@serverlessinstancechall.ztcznqz.mongodb.net/?authSource=%24external&authMechanism=MONGODB-AWS&retryWrites=true&w=majority&authMechanismProperties=AWS_SESSION_TOKEN:{credentials['SessionToken']}&appName=ServerlessInstanceChallengeRun"""
DATABASE_NAME = "running_data"
JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY")
LOCALDEV = True
JWT_EXPIRATION_TIME_MINUTES = 5
JWT_ALGORITHM = "HS256"

