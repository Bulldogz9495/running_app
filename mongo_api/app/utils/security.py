from datetime import datetime, timedelta
import jwt
from passlib.context import CryptContext
from app.settings import JWT_EXPIRATION_TIME_MINUTES, JWT_EXPIRATION_TIME_HOURS, JWT_SECRET_KEY, JWT_ALGORITHM


# Hashing password
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str):
    hashed_password = pwd_context.hash(password)
    return hashed_password
    
# Function to create access token
def create_access_token(data: dict, expires_delta: timedelta=timedelta(hours=JWT_EXPIRATION_TIME_HOURS)):
    to_encode = data.copy()
    expire = datetime.now() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, str(JWT_SECRET_KEY), algorithm=JWT_ALGORITHM)
    return encoded_jwt

# Function to verify password
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def authenticate_user(username: str, password: str, hashed_password: str):
    if not verify_password(password, hashed_password):
        return False
    return True

def verify_token(token: str):
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return payload
    except JWTError:
        raise GetTokenError


Invoke-WebRequest -UseBasicParsing -Uri "http://challenge-run-load-balancer-14265435.us-east-1.elb.amazonaws.com/Users/user1%40example.com" `
 -WebSession $session `
 -Headers @{
 "Accept-Encoding"="gzip, deflate"
   "Accept-Language"="en-US,en;q=0.9"
   "Referer"="http://challenge-run-load-balancer-14265435.us-east-1.elb.amazonaws.com/docs"
   "accept"="application/json"
   "AUTHORIZATION"="Bearer abc"
 }