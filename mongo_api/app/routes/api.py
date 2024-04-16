from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from app.models.user import User, Token
from app.models.run import Run
from app.models.team import Team
from app.services.mongodb_service import MongoDBService
from typing import List, Annotated
from bson import Binary, UuidRepresentation
from uuid import UUID
import uuid
import json
from pymongo.results import InsertOneResult
from app.settings import JWT_EXPIRATION_TIME_MINUTES
from app.utils.security import authenticate_user, create_access_token, get_password_hash
from datetime import timedelta

router = APIRouter()
db_service = MongoDBService()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/token")

@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await db_service.db.users.find_one({"email": form_data.username})
    if not user:
        raise HTTPException(status=404, detail="User Email not found")
    if not authenticate_user(form_data.username, form_data.password, user['password']):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    access_token_expires = timedelta(minutes=JWT_EXPIRATION_TIME_MINUTES)
    access_token = create_access_token(
        data={"sub": user['email']}, expires_delta=access_token_expires
    )
    print(user)
    return {
        "access_token": access_token, 
        "token_type": "bearer", 
    }



@router.get("/health")
async def health():
    return {"status": "ok"}

@router.get("/Users/{item_id}", response_model=User)
async def read_item(item_id: str, token: str = Depends(oauth2_scheme)):
    user_data = await db_service.db.users.find_one({"id": item_id})
    if user_data is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user_data

@router.post("/Users", response_model=User)
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
    return inserted_user


@router.patch("/Users/{item_id}", response_model=User)
async def update_user(user_data: User, item_id: str, token: str = Depends(oauth2_scheme)):
    print(user_data)
    existing_data = await db_service.db.users.find_one({"id": item_id})
    if existing_data is None:
        raise HTTPException(status_code=404, detail="User could not be found")
    update_data = user_data.model_dump()
    await db_service.db.users.update_one({'id': item_id}, {'$set': update_data})
    # Fetch and return the updated user data
    updated_user = await db_service.db.users.find_one({'id': item_id})
    updated_user.pop('_id')  # Remove MongoDB ObjectId
    return updated_user
    

@router.get("/Users", response_model=List[User])
async def get_all_users(token: str = Depends(oauth2_scheme)):
    users = []
    async for user_data in db_service.db.users.find():
        users.append(user_data)
    return users

@router.get("/Teams/{item_id}", response_model=Team)
async def read_team(item_id: str):
    team_data = await db_service.db.teams.find_one({"id": item_id})
    if team_data is None:
        raise HTTPException(status_code=404, detail="Team not found")
    return team_data

@router.post("/Teams", response_model=Team)
async def create_team(team_data: Team):
    existing_id = await db_service.db.users.find_one({'id': team_data.id})
    if existing_id:
        raise HTTPException(status_code=409, detail="id Already Exists")
    result = await db_service.db.teams.insert_one(team_data.model_dump())
    if isinstance(result, InsertOneResult) and result.acknowledged:
        return team_data
    else:
        return HTTPException(status_code=422, detail="Team failed to create")

@router.get("/Teams", response_model=List[Team])
async def get_all_teams(token: str = Depends(oauth2_scheme)):
    teams = []
    async for team_data in db_service.db.teams.find():
        teams.append(team_data)
    return teams    

@router.get("/Runs/{item_id}", response_model=Run)
async def read_run(item_id: str):
    run_data = await db_service.db.runs.find_one({"id": item_id})
    if run_data is None:
        raise HTTPException(status_code=404, detail="Run not found")
    return run_data

@router.post("/Runs", response_model=Run)
async def create_run(run_data: Run):
    existing_id = await db_service.db.users.find_one({'id': run_data.id})
    if existing_id:
        raise HTTPException(status_code=409, detail="id Already Exists")
    result = await db_service.db.runs.insert_one(run_data.model_dump())
    inserted_run = await db_service.db.runs.find_one({"id": result.inserted_id})
    if isinstance(result, InsertOneResult) and result.acknowledged:
        return run_data
    else:
        return HTTPException(status_code=422, detail="Run failed to create")


@router.get("/Runs", response_model=List[Run])
async def get_all_runs(token: str = Depends(oauth2_scheme)):
    runs = []
    async for run_data in db_service.db.runs.find():
        runs.append(run_data)
    return runs    


@router.delete("/delete_all")
async def delete_all_collections(token: str = Depends(oauth2_scheme)):
    collection_names = await db_service.db.list_collection_names()
    for collection_name in collection_names:
        await db_service.db[collection_name].drop()
    return {"message": "All collections deleted"}