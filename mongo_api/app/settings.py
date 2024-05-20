import os, time, json
import logging
import dotenv
import boto3
from urllib.parse import quote_plus


def setup_logger():
    # Configure root logger
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
    
    # Get the root logger
    logger = logging.getLogger()
    return logger

# Initialize the logger
logger = setup_logger()

feature_toggles = {
    "secret_manager": False
}

if feature_toggles["secret_manager"]:
    try:
        secret_name = "prod/env"
        region_name = "us-east-1"

        # Create a Secrets Manager client
        session = boto3.session.Session()
        client = session.client(
            service_name='secretsmanager',
            region_name=region_name
        )

        get_secret_value_response = client.get_secret_value(
            SecretId=secret_name
        )
        secret = json.loads(get_secret_value_response['SecretString'])

        JWT_SECRET_KEY = secret["JWT_SECRET_KEY"]
        DATABASE_PASSWORD = secret["DATABASE_ABOYER_PASSWORD"]
        ENVIRONMENT = secret["ENVIRONMENT_PROD"]
    except Exception as e:
        logger.info("You are probably not in production so boto fails when trying to get secrets")
        logger.info(e)
        JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY")
        DATABASE_PASSWORD = os.environ.get("DATABASE_PASSWORD")
else:
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY")
    DATABASE_PASSWORD = os.environ.get("DATABASE_PASSWORD")


while "DATABASE_USER" not in os.environ:
    dotenv.load_dotenv()
    time.sleep(1)
    logger.info("Waiting 1 second for env variables")
    logger.info(os.environ)
DBHOST = os.environ.get('DBHOST', default="mongodb")
DBPORT = os.environ.get('DBPORT', default=27017)
DATABASE_USER = os.environ.get('DATABASE_USER')
DATABASE_PASSWORD = os.environ.get('DATABASE_PASSWORD')
ENVIRONMENT= os.environ.get('ENVIRONMENT')
if ENVIRONMENT == "local":
    DATABASE_URL = f"""mongodb+srv://{DATABASE_USER}:{DATABASE_PASSWORD}@cluster0.dku630t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"""
else:
    credentials=boto3.Session().get_credentials()
    DATABASE_URL = f"""mongodb+srv://{quote_plus(credentials.access_key)}:{quote_plus(credentials.secret_key)}@serverlessinstance0-pe-1.ytovzs1.mongodb.net/?authSource=%24external&authMechanism=MONGODB-AWS&retryWrites=true&w=majority&authMechanismProperties=AWS_SESSION_TOKEN:{quote_plus(credentials.token)}&appName=ServerlessInstance0"""
    logger.info(f"{DATABASE_URL}")
DATABASE_NAME = "running_data"
JWT_EXPIRATION_TIME_MINUTES = 5
JWT_ALGORITHM = "HS256"
TOKEN_REFRESH_TIME = 30 * 60

CLUSTER_NAME = "challenge_run_cluster"
SERVICE_NAME = "mongo-api-service"
TARGET_GROUP_ARN = "arn:aws:elasticloadbalancing:us-east-1:920990234657:targetgroup/challenge-run-target-group/77cce335ebd88560"