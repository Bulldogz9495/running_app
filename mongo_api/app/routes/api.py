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
from app.settings import JWT_EXPIRATION_TIME_MINUTES, logger
from app.utils.security import authenticate_user, create_access_token, get_password_hash
from datetime import timedelta
from datetime import datetime

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
    logger.info("User Login Successful: %s, %s", user, access_token)
    return {
        "access_token": access_token, 
        "token_type": "bearer", 
    }


@router.get("/health")
async def health():
    return {"status": "ok"}


@router.get("/Users/{email}", response_model=User)
async def read_item(email: str, token: str = Depends(oauth2_scheme)):
    user_data = await db_service.db.users.find_one({"email": email})
    if user_data is None:
        raise HTTPException(status_code=404, detail="User {email} not found")
    logger.info(f"Getting User: {email}")
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
    logger.info(f"User Created: {user_data}")
    return inserted_user


@router.patch("/Users/id/{item_id}", response_model=User)
async def update_user_by_id(user_data: dict, item_id: str, token: str = Depends(oauth2_scheme)):
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


@router.patch("/Users/username/{username}", response_model=User)
async def update_user_by_(user_data: dict, username: str, token: str = Depends(oauth2_scheme)):
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


@router.get("/Users", response_model=List[User])
async def get_all_users(token: str = Depends(oauth2_scheme)):
    users = []
    async for user_data in db_service.db.users.find():
        users.append(user_data)
    logger.info(f"Get All Users")
    return users


@router.get("/Teams/{item_id}", response_model=Team)
async def read_team(item_id: str):
    team_data = await db_service.db.teams.find_one({"id": item_id})
    if team_data is None:
        raise HTTPException(status_code=404, detail="Team not found")
    logger.info(f"Get Team: {item_id}")
    return team_data

@router.get("/Teams/user_id/{user_id}", response_model=List[dict])
async def read_teams_for_user(
    user_id: str,
    skip: int = 0,
    limit: int = 10,
):
    teams = []
    async for team_data in db_service.db.teams.find({"members":{"$in": [user_id]}}).skip(skip).limit(limit):
        team_data.pop('_id')
        members_info = []
        for member in team_data['members']:
            member_info = await db_service.db.users.find_one({"id": member})
            members_info.append({
                'id': member_info['id'],
                'email': member_info['email'],
                'last_name': member_info['last_name'],
                'first_name': member_info['first_name']
            })
        team_data['members_info'] = members_info
        teams.append(team_data)
    logger.info(f"Get Teams for user: {user_id}")
    print(teams)
    return teams


@router.post("/Teams", response_model=Team)
async def create_team(team_data: Team):
    existing_id = await db_service.db.users.find_one({'id': team_data.id})
    if existing_id:
        raise HTTPException(status_code=409, detail="id Already Exists")
    result = await db_service.db.teams.insert_one(team_data.model_dump())
    if isinstance(result, InsertOneResult) and result.acknowledged:
        logger.info(f"Team Created: {team_data}")
        return team_data
    else:
        return HTTPException(status_code=422, detail="Team failed to create")


@router.get("/Teams", response_model=List[Team])
async def get_all_teams(token: str = Depends(oauth2_scheme)):
    teams = []
    async for team_data in db_service.db.teams.find():
        teams.append(team_data)
    logger.info(f"Get All Teams")
    return teams


@router.get("/Runs/{item_id}", response_model=Run)
async def read_run(item_id: str):
    run_data = await db_service.db.runs.find_one({"id": item_id})
    if run_data is None:
        raise HTTPException(status_code=404, detail="Run not found")
    logger.info(f"Get Run: {item_id}")
    return run_data


@router.get("/Runs/user_id/{user_id}", response_model=List[Run])
async def read_runs_for_user(user_id: str,
                             skip: int = 0,
                             limit: int = 10,
                             include_geopoints: bool = True):
    runs = []
    async for run_data in db_service.db.runs.find({"user_id": user_id}).skip(skip).limit(limit):
        if not include_geopoints:
            run_data['geopoints'] = []
        runs.append(run_data)
    logger.info(f"Get Runs for user: {user_id}")
    return runs

@router.get("/Runs/team_id/{team_id}", response_model=List[Run])
async def read_runs_for_user(team_id: str,
                             skip: int = 0,
                             limit: int = 10,
                             include_geopoints: bool = True):
    runs = []
    async for run_data in db_service.db.runs.find({"teams":{"$in": [team_id]}}).skip(skip).limit(limit):
        if not include_geopoints:
            run_data['geopoints'] = []
        runs.append(run_data)
    logger.info(f"Get Runs for Team: {team_id}")
    return runs

@router.get("/Runs/team_id/{team_id}/date/{date}", response_model=List[Run])
async def read_runs_for_user(team_id: str,
                             date: str,
                             skip: int = 0,
                             limit: int = 10,
                             include_geopoints: bool = True):
    runs = []
    date_filter = {'$gte': datetime.fromisoformat(date), '$lt': datetime.fromisoformat(date+"T23:59:59.999Z")}
    async for run_data in db_service.db.runs.find({"teams":{"$in": [team_id]}, "end_datetime": date_filter}).skip(skip).limit(limit):
        if not include_geopoints:
            run_data['geopoints'] = []
        runs.append(run_data)
    logger.info(f"Get Runs for Team: {team_id} on Date: {date}")
    return runs


@router.post("/Runs", response_model=Run)
async def create_run(run_data: Run):
    result = await db_service.db.runs.insert_one(run_data.model_dump())
    inserted_run = await db_service.db.runs.find_one({"id": result.inserted_id})
    if isinstance(result, InsertOneResult) and result.acknowledged:
        logger.info(f"Run {run_data.id} Created for user {run_data.user_id}")
        return run_data
    else:
        return HTTPException(status_code=422, detail="Run failed to create")


@router.get("/Runs", response_model=List[Run])
async def get_all_runs(token: str = Depends(oauth2_scheme)):
    runs = []
    async for run_data in db_service.db.runs.find():
        runs.append(run_data)
    logger.info(f"Get All Runs")
    return runs    


@router.delete("/delete_all")
async def delete_all_collections(token: str = Depends(oauth2_scheme)):
    collection_names = await db_service.db.list_collection_names()
    for collection_name in collection_names:
        await db_service.db[collection_name].drop()
    logger.info("All collections deleted")
    return {"message": "All collections deleted"}