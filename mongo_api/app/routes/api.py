from fastapi import APIRouter, HTTPException
from app.models.user import User
from app.models.run import Run
from app.models.team import Team
from app.services.mongodb_service import MongoDBService
from typing import List
from bson import Binary, UuidRepresentation
from uuid import UUID
import uuid

router = APIRouter()
db_service = MongoDBService()

@router.get("/Users/{item_id}", response_model=User)
async def read_item(item_id: str):
    user_data = await db_service.db.users.find_one({"_id": item_id})
    if user_data is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user_data

@router.post("/Users", response_model=User)
async def create_user(user_data: User):
    print(user_data)
    existing_user = await db_service.db.users.find_one({'email': user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email Already Exists")
    user_data._id = Binary.from_uuid(user_data._id)
    result = await db_service.db.users.insert_one(user_data.model_dump())
    inserted_user = await db_service.db.users.find_one({"_id": result.inserted_id})
    if inserted_user is None:
        raise HTTPException(status_code=404, detail="Failed to create user")

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
    team_data = await db_service.db.teams.find_one({"_id": item_id})
    if team_data is None:
        raise HTTPException(status_code=404, detail="Team not found")
    return team_data

@router.post("/Teams", response_model=Team)
async def create_team(team_data: Team):
    team_data._id = uuid.uuid4()
    result = await db_service.db.teams.insert_one(team_data.model_dump())
    inserted_team = await db_service.db.teams.find_one({"_id": result.inserted_id})
    if inserted_team is None:
        raise HTTPException(status_code=404, detail="Failed to create team")

    return inserted_team

@router.get("/Teams", response_model=List[Team])
async def get_all_teams():
    teams = []
    async for team_data in db_service.db.teams.find():
        teams.append(team_data)
    return teams    

@router.get("/Runs/{item_id}", response_model=Run)
async def read_run(item_id: str):
    run_data = await db_service.db.runs.find_one({"_id": item_id})
    if run_data is None:
        raise HTTPException(status_code=404, detail="Run not found")
    return run_data

@router.post("/Runs", response_model=Run)
async def create_run(run_data: Run):
    result = await db_service.db.runs.insert_one(run_data.model_dump())
    # Manually encode UUID fields to BSON binary
    run_data._id = Binary.from_uuid(run_data._id)
    run_data.user_id = Binary.from_uuid(run_data.user_id)
    inserted_run = await db_service.db.runs.find_one({"_id": result.inserted_id})
    if inserted_run is None:
        raise HTTPException(status_code=404, detail="Failed to create run")

    return inserted_run

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