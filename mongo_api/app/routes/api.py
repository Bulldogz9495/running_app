from fastapi import APIRouter, HTTPException
from app.models.user import User
from app.models.run import Run
from app.models.team import Team
from app.services.mongodb_service import MongoDBService
from typing import List
from bson import Binary, UuidRepresentation
from uuid import UUID
import uuid
from pymongo.results import InsertOneResult

router = APIRouter()
db_service = MongoDBService()

@router.get("/Users/{item_id}", response_model=User)
async def read_item(item_id: str):
    user_data = await db_service.db.users.find_one({"id": item_id})
    if user_data is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user_data

@router.post("/Users", response_model=User)
async def create_user(user_data: User):
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

@router.get("/Users", response_model=List[User])
async def get_all_users():
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
async def get_all_teams():
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
async def get_all_runs():
    runs = []
    async for run_data in db_service.db.runs.find():
        runs.append(run_data)
    return runs    


@router.delete("/delete_all")
async def delete_all_collections():
    collection_names = await db_service.db.list_collection_names()
    for collection_name in collection_names:
        await db_service.db[collection_name].drop()
    return {"message": "All collections deleted"}