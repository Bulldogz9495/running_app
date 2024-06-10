from fastapi import APIRouter, HTTPException, Depends
from typing import List, Annotated, Optional
from app.models.team import Team, Invitation
from app.models.user import Token
from app.services.mongodb_service import MongoDBService
from fastapi.security import OAuth2PasswordBearer

db_service = MongoDBService()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/token")

team_router = APIRouter()

@team_router.get("/Teams/{item_id}", response_model=dict)
async def read_team(item_id: str):
    team_data = await db_service.db.teams.find_one({"id": item_id})
    if team_data is None:
        raise HTTPException(status_code=404, detail="Team not found")
    team_data.pop('_id')
    team_data['members_info'] = [await _get_member_info(member) for member in team_data['members']]
    print(team_data)
    logger.info(f"Get Team: {item_id}")
    return team_data


@team_router.get("/Teams/user_id/{user_id}", response_model=List[dict])
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

@team_router.post("/Teams", response_model=Team)
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


@team_router.patch("/Teams/id/{team_id}", response_model=Team)
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


@team_router.get("/Teams", response_model=List[Team])
async def get_all_teams(token: str = Depends(oauth2_scheme)):
    teams = []
    async for team_data in db_service.db.teams.find():
        team_data.pop('_id')
        teams.append(team_data)
    logger.info(f"Get All Teams")
    return teams

# Add Invitation Using team id and user id
@team_router.post("/Teams/{team_id}/invitations/{user_id}")
async def add_invitation(team_id: str, user_id: str, invitation_id: Optional[str] = None):
    team = await db_service.db.teams.find_one({"id": team_id})
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    user = await db_service.db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    # if not any(invitation['user_id'] == user_id for invitation in team['invitations']):
    #     raise HTTPException(status_code=400, detail="User Invitation not found")
    if 'invitations' not in team:
        team['invitations'] = []
    team['invitations'].append(Invitation(
        user_id=user_id,
        team_id=team_id,
        id = invitation_id if invitation_id else str(uuid.uuid4()),
        date_created = datetime.now(),
        pending = True,
        date_accepted = None
    ).dict())
    await db_service.db.teams.update_one({"id": team_id}, {'$set': team})
    return {"message": "Invitation added"}

# Get Invitations By Team ID
@team_router.get("/Teams/{team_id}/invitations", response_model=List[Invitation])
async def get_invitations(team_id: str):
    team = await db_service.db.teams.find_one({"id": team_id})
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    return team['invitations']

# Create a team invitation without user id
@team_router.post("/Teams/{team_id}/invitations")
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
@team_router.patch("/Teams/{team_id}/invitations/{invitation_id}")
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
@team_router.delete("/Teams/{team_id}/invitations/{invitation_id}")
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


async def _get_member_info(member_id):
    member_info = await db_service.db.users.find_one({"id": member_id})
    return {
        'id': member_info['id'],
        'email': member_info['email'],
        'last_name': member_info['last_name'],
        'first_name': member_info['first_name']
    }