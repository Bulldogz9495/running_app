from typing import List, Annotated, Optional
from app.services.mongodb_service import MongoDBService
from fastapi.security import OAuth2PasswordBearer
from fastapi import APIRouter, HTTPException, Depends
from app.models.run import Run
from app.settings import logger
from pymongo.results import InsertOneResult
import pymongo
from datetime import datetime
from app.utils.async_tasks import add_run_to_state_challenge

run_router = APIRouter()

db_service = MongoDBService()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/token")

@run_router.get("/Runs/{item_id}", response_model=Run)
async def read_run(item_id: str):
    run_data = await db_service.db.runs.find_one({"id": item_id})
    if run_data is None:
        raise HTTPException(status_code=404, detail="Run not found")
    logger.info(f"Get Run: {item_id}")
    return run_data


@run_router.get("/Runs/user_id/{user_id}", response_model=List[Run])
async def read_runs_for_user(user_id: str,
                             skip: int = 0,
                             limit: int = 10,
                             include_geopoints: bool = True,
                             sort_datetime: str = "asc"):
    runs = []
    sort_datetime = pymongo.ASCENDING if sort_datetime == "asc" else pymongo.DESCENDING
    async for run_data in db_service.db.runs.find({"user_id": user_id}).sort("start_datetime", sort_datetime).skip(skip).limit(limit):
        if not include_geopoints:
            run_data['geopoints'] = []
        run_data['start_datetime'] = run_data['start_datetime'].astimezone()
        run_data['end_datetime'] = run_data['end_datetime'].astimezone()
        runs.append(run_data)
    logger.info(f"Get Runs for user: {user_id} - Sort Order: {sort_datetime}")
    return runs

@run_router.get("/Runs/team_id/{team_id}", response_model=List[Run])
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

@run_router.get("/Runs/team_id/{team_id}/date/{date}", response_model=List[Run])
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


@run_router.post("/Runs", response_model=Run)
async def create_run(run_data: Run, token: str = Depends(oauth2_scheme)):
    result = await db_service.db.runs.insert_one(run_data.model_dump())
    inserted_run = await db_service.db.runs.find_one({"id": result.inserted_id})
    if isinstance(result, InsertOneResult) and result.acknowledged:
        logger.info(f"Run {run_data.id} Created for user {run_data.user_id}")
        await add_run_to_state_challenge(run_data)
        return run_data
    else:
        return HTTPException(status_code=422, detail="Run failed to create")


@run_router.get("/Runs", response_model=List[Run])
async def get_all_runs(token: str = Depends(oauth2_scheme)):
    runs = []
    async for run_data in db_service.db.runs.find():
        runs.append(run_data)
    logger.info(f"Get All Runs")
    return runs    
