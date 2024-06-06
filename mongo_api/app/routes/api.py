from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from app.models.user import User, Token
from app.models.run import Run
from app.models.team import Team, Invitation
from app.services.mongodb_service import MongoDBService
from typing import List, Annotated, Optional
from bson import Binary, UuidRepresentation
from uuid import UUID
import uuid
import json
from pymongo.results import InsertOneResult
import pymongo
from app.settings import JWT_EXPIRATION_TIME_MINUTES, logger
from app.utils.security import authenticate_user, create_access_token, get_password_hash
from datetime import timedelta
from datetime import datetime
from pydantic import BaseModel

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


@router.get("/Users/search/", response_model=List[User])
async def search_users(
    first_name: Optional[str] = None, 
    last_name: Optional[str] = None, 
    email: Optional[str] = None,
    token: str = Depends(oauth2_scheme)
):
    print(first_name, last_name, email)
    logger.info(f"Searching Users: {first_name}, {last_name}, {email}")
    query = {"$and": []}
    if first_name is not None:
        logger.info(first_name)
        query["$and"].append({"first_name": {"$regex": first_name, "$options": 'i'}})
    if last_name is not None:
        logger.info(last_name)
        query["$and"].append({"last_name": {"$regex": last_name, "$options": 'i'}})
    if email is not None:
        logger.info(email)
        query["$and"].append({"email": {"$regex": email, "$options": 'i'}})
    logger.info(query)
    users = []
    async for user in db_service.db.users.find(query):
        user.pop('_id')
        users.append(user)
    return users

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


async def _get_member_info(member_id):
    member_info = await db_service.db.users.find_one({"id": member_id})
    return {
        'id': member_info['id'],
        'email': member_info['email'],
        'last_name': member_info['last_name'],
        'first_name': member_info['first_name']
    }
    

@router.get("/Teams/{item_id}", response_model=dict)
async def read_team(item_id: str):
    team_data = await db_service.db.teams.find_one({"id": item_id})
    if team_data is None:
        raise HTTPException(status_code=404, detail="Team not found")
    team_data.pop('_id')
    team_data['members_info'] = [await _get_member_info(member) for member in team_data['members']]
    print(team_data)
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
        team_data['members_info'] = [await _get_member_info(member) for member in team_data['members']]
        teams.append(team_data)
    logger.info(f"Get Teams for user: {user_id}")
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


@router.patch("/Teams/id/{team_id}", response_model=Team)
async def update_team_by_id(team_data: dict, team_id: str):
    existing_team = await db_service.db.teams.find_one({"id": team_id})
    if existing_team is None:
        raise HTTPException(status_code=404, detail="Team could not be found")
    for k, v in team_data.items():
        if v is not None:
            existing_team[k] = v
    await db_service.db.teams.update_one({"id": team_id}, {'$set': existing_team})
    # Fetch and return the updated team data
    updated_team = await db_service.db.teams.find_one({"id": team_id})
    updated_team.pop('_id')  # Remove MongoDB ObjectId
    logger.info(f"Team {team_id} patched with data {team_data}")
    return updated_team


@router.get("/Teams", response_model=List[Team])
async def get_all_teams(token: str = Depends(oauth2_scheme)):
    teams = []
    async for team_data in db_service.db.teams.find():
        team_data.pop('_id')
        teams.append(team_data)
    logger.info(f"Get All Teams")
    return teams

# Add Invitation Using team id and user id
@router.post("/Teams/{team_id}/invitations/{user_id}")
async def add_invitation(team_id: str, user_id: str):
    team = await db_service.db.teams.find_one({"id": team_id})
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    user = await db_service.db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    # if not any(invitation['user_id'] == user_id for invitation in team['invitations']):
    #     raise HTTPException(status_code=400, detail="User Invitation not found")
    team['invitations'].append(Invitation(
        user_id=user_id,
        team_id=team_id,
        id = str(uuid.uuid4()),
        date_created = datetime.now(),
        pending = True,
        date_accepted = None
    ).dict())
    await db_service.db.teams.update_one({"id": team_id}, {'$set': team})
    return {"message": "Invitation added"}

# Get Invitations By Team ID
@router.get("/Teams/{team_id}/invitations", response_model=List[Invitation])
async def get_invitations(team_id: str):
    team = await db_service.db.teams.find_one({"id": team_id})
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    return team['invitations']

# Create a team invitation without user id
@router.post("/Teams/{team_id}/invitations")
async def create_invitation(team_id: str):
    team = await db_service.db.teams.find_one({"id": team_id})
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    team['invitations'].append(Invitation(
        user_id=None,
        team_id=team_id,
        id = str(uuid.uuid4()),
        date_created = datetime.now(),
        pending = True,
        date_accepted = None
    ).dict())
    await db_service.db.teams.update_one({"id": team_id}, {'$set': team})
    return {"message": "Invitation created"}

# Accept or reject an invitation based on invitee input
@router.patch("/Teams/{team_id}/invitations/{invitation_id}")
async def patch_invitation_by_id(team_id: str, invitation_id: str, accepted: bool, user_id: str = None):
    team = await db_service.db.teams.find_one({"id": team_id})
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    if user_id in team['members']:
        raise HTTPException(status_code=409, detail="User already a member")
    if not any(invitation['id'] == invitation_id for invitation in team['invitations']):
        raise HTTPException(status_code=400, detail="Invitation not found")
    if accepted:
        for invitation in team['invitations']:
            if invitation['id'] == invitation_id:
                invitation["pending"] = False
                invitation["date_accepted"] = datetime.now()
                if invitation["user_id"] is not None:
                    print("Invitation User ID: ", invitation["user_id"])
                    if invitation["user_id"] in team['members']:
                        raise HTTPException(status_code=409, detail="User already a member")
                    team['members'].append(invitation["user_id"])
                else:
                    if user_id is not None:
                        team['members'].append(user_id)
                    else:
                        raise HTTPException(status_code=422, detail="User id must be sent for the given invitation")
                break
    else:
        for invitation in team['invitations']:
            if invitation['id'] == invitation_id:
                invitation["pending"] = False
                invitation["date_accepted"] = None
                break
    team['size'] = len(team['members'])
    await db_service.db.teams.update_one({"id": team_id}, {'$set': team})
    return {"message": "Invitation updated"}

# Delete an invitation
@router.delete("/Teams/{team_id}/invitations/{invitation_id}")
async def delete_invitation(team_id: str, invitation_id: str):
    team = await db_service.db.teams.find_one({"id": team_id})
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    if not any(invitation['id'] == invitation_id for invitation in team['invitations']):
        raise HTTPException(status_code=400, detail="Invitation not found")
    for invitation in team['invitations']:
            if invitation['id'] == invitation_id:
                team['invitations'].remove(invitation)
    await db_service.db.teams.update_one({"id": team_id}, {'$set': team})
    return {"message": "Invitation deleted"}


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
                             include_geopoints: bool = True,
                             sort_datetime: str = "asc"):
    runs = []
    sort_datetime = pymongo.ASCENDING if sort_datetime == "asc" else pymongo.DESCENDING
    async for run_data in db_service.db.runs.find({"user_id": user_id}).sort("start_datetime", sort_datetime).skip(skip).limit(limit):
        if not include_geopoints:
            run_data['geopoints'] = []
        runs.append(run_data)
    logger.info(f"Get Runs for user: {user_id} - Sort Order: {sort_datetime}")
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