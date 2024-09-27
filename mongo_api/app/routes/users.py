from fastapi import APIRouter, HTTPException, Depends, Security
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from app.models.user import User, Token, Message
from typing import List, Annotated, Optional
from bson import Binary, UuidRepresentation
from uuid import UUID
import uuid
import json
import pymongo
from app.settings import logger, JWT_EXPIRATION_TIME_MINUTES, JWT_EXPIRATION_TIME_HOURS
from app.utils.security import authenticate_user, create_access_token, get_password_hash, verify_token
from datetime import timedelta
from datetime import datetime
from pydantic import BaseModel
from app.services.mongodb_service import MongoDBService

user_router = APIRouter()

db_service = MongoDBService()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/token")

@user_router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await db_service.db.users.find_one({"email": form_data.username})
    if not user:
        logger.info("Login Failed: User Email not found: %s", form_data.username)
        raise HTTPException(status=404, detail="User Email not found")
    if not authenticate_user(form_data.username, form_data.password, user['password']):
        logger.info("Login Failed:Invalid username or password: %s", form_data.username)
        raise HTTPException(status_code=401, detail="Invalid username or password")
    access_token_expires = timedelta(hours=JWT_EXPIRATION_TIME_HOURS, minutes=JWT_EXPIRATION_TIME_MINUTES)
    access_token = create_access_token(
        data={"sub": user['email']}, expires_delta=access_token_expires
    )
    logger.info("User Login Successful: %s, %s", user, access_token)
    return {
        "access_token": access_token, 
        "token_type": "bearer", 
    }

@user_router.get("/Users/{email}", response_model=User)
async def read_item(email: str, token: str = Security(oauth2_scheme)):
    verify_token(token)
    user_data = await db_service.db.users.find_one({"email": email})
    if user_data is None:
        raise HTTPException(status_code=404, detail="User {email} not found")
    logger.info(f"Getting User: {email}")
    return user_data


@user_router.get("/search/Users", response_model=List[User])
async def search_users(
    first_name: Optional[str] = None, 
    last_name: Optional[str] = None, 
    email: Optional[str] = None,
    token: str = Security(oauth2_scheme)
):
    logger.info(f"Searching Users: {first_name}, {last_name}, {email}")
    query = {"$and": []}
    if first_name is not None:
        query["$and"].append({"first_name": {"$regex": first_name, "$options": 'i'}})
    if last_name is not None:
        query["$and"].append({"last_name": {"$regex": last_name, "$options": 'i'}})
    if email is not None:
        query["$and"].append({"email": {"$regex": email, "$options": 'i'}})
    users = []
    async for user in db_service.db.users.find(query):
        user.pop('_id')
        users.append(user)
    return users

@user_router.post("/Users", response_model=User)
async def create_user(user_data: User):
    if user_data.password:
        user_data.password = get_password_hash(user_data.password)
    existing_id = await db_service.db.users.find_one({'id': user_data.id})
    if existing_id:
        raise HTTPException(status_code=409, detail="id Already Exists")
    existing_user = await db_service.db.users.find_one({'email': user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email Already Exists")
    result = await db_service.db.users.insert_one(user_data.model_dump())
    inserted_user = await db_service.db.users.find_one({"_id": result.inserted_id})
    if inserted_user is None:
        raise HTTPException(status_code=404, detail="Failed to create user")
    inserted_user.pop('_id')
    # Return the inserted user data
    logger.info(f"User Created: {user_data}")
    return inserted_user


@user_router.patch("/Users/id/{item_id}", response_model=User)
async def update_user_by_id(user_data: dict, item_id: str, token: str = Security(oauth2_scheme)):
    existing_data = await db_service.db.users.find_one({"id": item_id})
    if existing_data is None:
        raise HTTPException(status_code=404, detail="User could not be found")
    for k, v in user_data.items():
        if k in existing_data:
            existing_data[k] = v
    update_data = user_data.model_dump()
    await db_service.db.users.update_one({'id': item_id}, {'$set': update_data})
    # Fetch and return the updated user data
    updated_user = await db_service.db.users.find_one({'id': item_id})
    updated_user.pop('_id')  # Remove MongoDB ObjectId
    logger.info(f"User {item_id} patched with data {user_data}")
    return updated_user


@user_router.patch("/Users/username/{username}", response_model=User)
async def update_user_by_(user_data: dict, username: str, token: str = Security(oauth2_scheme)):
    existing_data = await db_service.db.users.find_one({"email": username})
    if existing_data is None:
        raise HTTPException(status_code=404, detail="User could not be found")
    for k, v in user_data.items():
        if k in existing_data:
            existing_data[k] = v
    await db_service.db.users.update_one({'email': username}, {'$set': existing_data})
    # Fetch and return the updated user data
    updated_user = await db_service.db.users.find_one({'email': username})
    updated_user.pop('_id')  # Remove MongoDB ObjectId
    logger.info(f"User {username} patched with data {user_data} to create {updated_user}")
    return updated_user


@user_router.get("/Users", response_model=List[User])
async def get_all_users(token: str = Security(oauth2_scheme)):
    users = []
    async for user_data in db_service.db.users.find():
        users.append(user_data)
    logger.info(f"Get All Users")
    return users


@user_router.get("/Users/{user_id}/messages", response_model=List[Message])
async def get_user_messages(user_id: str, skip: int = 0, limit: int = 10):
    try:
        user_data = await db_service.db.users.find_one({"id": user_id})
        if user_data is None:
            raise HTTPException(status_code=404, detail="User not found")
        messages = await db_service.db.users.aggregate([
            {"$match": {"id": user_id}},
            {"$unset": ["_id"]},
            {"$unwind": "$messages"},
            {"$replaceRoot": {
                "newRoot": "$messages"
            }},
            {"$sort": {"messages.created": -1}},
            {"$limit": limit},
        ]).to_list(limit)
        print("Messages: ", messages)
        return messages
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get message: {str(e)}")
    


@user_router.get("/Users/{user_id}/messages/count")
async def get_user_message_count(user_id: str, read: bool = False):
    try:
        pipeline = [
            {"$match": {"id": user_id}},
            {"$unwind": "$messages"},
            {"$count": "count"}
        ]
        if not read:
            logger.info("Not read")
            pipeline.insert(2, {"$match": {"messages.read": read}})
        result = await db_service.db.users.aggregate(pipeline).to_list(None)
        logger.info(f"Message count: {result}")
        if len(result) == 0:
            return 0
        return result[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get message count: {str(e)}")



@user_router.post("/Users/{user_id}/messages", response_model=dict)
async def post_user_message(user_id: str, message: Message):
    try:
        existing_message = await db_service.db.users.find_one({"id": user_id, "messages.id": message.id})
        if existing_message is not None:
            raise HTTPException(status_code=409, detail="Message with that id already exists")
        user_data = await db_service.db.users.find_one_and_update(
            {"id": user_id},
            {'$push': {'messages': message.model_dump()}},
            return_document=True
        ) # This will search by user id and push a new message to the array (if the array doesn't exist, it will create it) and return the updated document (whole user_)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to post message: {str(e)}")
    if user_data is None:
        raise HTTPException(status_code=404, detail="User not found")
    return {'success': True}


@user_router.patch("/Users/{user_id}/messages/{message_id}", response_model=dict)
async def patch_user_message(user_id: str, message_id: str, message: str = None, read: bool = False, token: str = Security(oauth2_scheme)):
    now = datetime.now()
    sort = {'$set': {'messages.$[element].updated': now}}
    if message is not None:
        sort['$set']['messages.$[element].message'] = message
    if read is not None:
        sort['$set']['messages.$[element].read'] = read
    user_data = await db_service.db.users.find_one_and_update(
        {"id": user_id, 'messages.id': message_id},
        sort,
        array_filters=[{'element.id': message_id}],
    )
    print(user_data)
    if user_data is None:
        raise HTTPException(status_code=404, detail="User or message not found")
    return {'success': True}


@user_router.delete("/Users/{user_id}/messages/{message_index}", response_model=str)
async def delete_user_message(user_id: str, message_index: str, token: str = Security(oauth2_scheme)):
    try:
        user_data = await db_service.db.users.find_one_and_update(
            {"id": user_id},
            {'$pull': {'messages': {'id': str(message_index)}}},
            return_document=True
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete message: {str(e)}")
    if user_data is None:
        raise HTTPException(status_code=404, detail="User or message not found")
    return "Message deleted"

