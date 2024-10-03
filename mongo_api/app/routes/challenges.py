import pymongo
from typing import List, Annotated, Optional
from app.services.mongodb_service import MongoDBService
from fastapi.security import OAuth2PasswordBearer
from fastapi import APIRouter, HTTPException, Depends, Response
from app.models.challenge import Challenge, TeamChallenge, GeographicChallenge, UserChallenge
from app.settings import logger


challenge_router = APIRouter()
db_service = MongoDBService()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/token")

@challenge_router.get("/Challenges", response_model=List[Challenge])
async def get_all_challenges(challenge_id: str = None):
    challenges = []
    if challenge_id is not None:
        async for challenge_data in db_service.db.challenges.find({"id": challenge_id}):
            challenges.append(challenge_data)
            logger.info(f"Get Challenge {challenge_id}")
    else:
        async for challenge_data in db_service.db.challenges.find():
            challenges.append(challenge_data)
            logger.info(f"Get All Challenges")
    return challenges

@challenge_router.get("/TeamChallenges", response_model=List[TeamChallenge])
async def get_all_challenges(challenge_id: str = None):
    challenges = []
    if challenge_id is not None:
        async for challenge_data in db_service.db.team_challenges.find({"id": challenge_id}):
            challenges.append(challenge_data)
            logger.info(f"Get Team Challenge {challenge_id}")
    else:
        async for challenge_data in db_service.db.team_challenges.find():
            challenges.append(challenge_data)
            logger.info(f"Get All Team Challenges")
    return challenges

@challenge_router.get("/UserChallenges", response_model=List[UserChallenge])
async def get_all_challenges(challenge_id: str = None):
    challenges = []
    if challenge_id is not None:
        async for challenge_data in db_service.db.user_challenges.find({"id": challenge_id}):
            challenges.append(challenge_data)
            logger.info(f"Get User Challenge {challenge_id}")
    else:
        async for challenge_data in db_service.db.user_challenges.find():
            challenges.append(challenge_data)
            logger.info(f"Get All User Challenges")
    return challenges

@challenge_router.get("/GeographicChallenges", response_model=List[GeographicChallenge])
async def get_all_challenges(challenge_id: str = None):
    challenges = []
    if challenge_id is not None:
        async for challenge_data in db_service.db.geographic_challenges.find({"id": challenge_id}):
            challenges.append(challenge_data)
            logger.info(f"Get Geographic Challenge {challenge_id}")
    else:
        async for challenge_data in db_service.db.geographic_challenges.find():
            challenges.append(challenge_data)
            logger.info(f"Get All Geographic Challenges")
    return challenges

@challenge_router.post("/Challenges", response_model=Challenge)
async def create_challenge(challenge: Challenge):
    check = await db_service.db.challenges.find_one({"id": challenge.id})
    if check:
        raise HTTPException(status_code=409, detail="Challenge with that id already exists")    
    try:
        new_challenge = await db_service.db.challenges.insert_one(challenge.model_dump())
        created_challenge = await db_service.db.challenges.find_one({"id": new_challenge.inserted_id})
        logger.info(f"Challenge {challenge.id} Created")
        return Response(status_code=201, content=created_challenge)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create challenge: {str(e)}")


@challenge_router.post("/TeamChallenges", response_model=TeamChallenge)
async def create_challenge(challenge: TeamChallenge):
    check = await db_service.db.team_challenges.find_one({"id": challenge.id})
    if check:
        raise HTTPException(status_code=409, detail="TeamChallenge with that id already exists")    
    try:
        new_challenge = await db_service.db.team_challenges.insert_one(challenge.model_dump())
        created_challenge = await db_service.db.team_challenges.find_one({"id": new_challenge.inserted_id})
        logger.info(f"TeamChallenge {challenge.id} Created")
        return Response(status_code=201, content=created_challenge)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create team challenge: {str(e)}")


@challenge_router.post("/UserChallenges", response_model=UserChallenge)
async def create_challenge(challenge: UserChallenge):
    check = await db_service.db.user_challenges.find_one({"id": challenge.id})
    if check:
        raise HTTPException(status_code=409, detail="UserChallenge with that id already exists")    
    try:
        new_challenge = await db_service.db.user_challenges.insert_one(challenge.model_dump())
        created_challenge = await db_service.db.user_challenges.find_one({"id": new_challenge.inserted_id})
        logger.info(f"UserChallenge {challenge.id} Created")
        return Response(status_code=201, content=created_challenge)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create user challenge: {str(e)}")


@challenge_router.post("/GeographicChallenges", response_model=GeographicChallenge)
async def create_challenge(challenge: GeographicChallenge):
    check = await db_service.db.geographic_challenges.find_one({"id": challenge.id})
    if check:
        raise HTTPException(status_code=409, detail="GeographicChallenge with that id already exists")    
    try:
        new_challenge = await db_service.db.geographic_challenges.insert_one(challenge.model_dump())
        created_challenge = await db_service.db.geographic_challenges.find_one({"id": new_challenge.inserted_id})
        logger.info(f"GeographicChallenge {challenge.id} Created")
        return Response(status_code=201, content=created_challenge)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create geographic challenge: {str(e)}")

@challenge_router.patch("/Challenges/{challenge_id}", response_model=Challenge)
async def patch_challenge(challenge_id: str, challenge: Challenge):
    try:
        updated_challenge = await db_service.db.challenges.find_one_and_update({"id": challenge_id}, {"$set": challenge.model_dump()})
        if updated_challenge is None:
            raise HTTPException(status_code=404, detail="Challenge not found")
        logger.info(f"Challenge {challenge_id} Updated")
        return updated_challenge
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update challenge: {str(e)}")

@challenge_router.patch("/TeamChallenges/{challenge_id}", response_model=TeamChallenge)
async def patch_challenge(challenge_id: str, challenge: TeamChallenge):
    try:
        updated_challenge = await db_service.db.team_challenges.find_one_and_update({"id": challenge_id}, {"$set": challenge.model_dump()})
        if updated_challenge is None:
            raise HTTPException(status_code=404, detail="Challenge not found")
        logger.info(f"TeamChallenge {challenge_id} Updated")
        return updated_challenge
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update team challenge: {str(e)}")


@challenge_router.patch("/UserChallenges/{challenge_id}", response_model=UserChallenge)
async def patch_challenge(challenge_id: str, challenge: UserChallenge):
    try:
        updated_challenge = await db_service.db.user_challenges.find_one_and_update({"id": challenge_id}, {"$set": challenge.model_dump()})
        if updated_challenge is None:
            raise HTTPException(status_code=404, detail="Challenge not found")
        logger.info(f"UserChallenge {challenge_id} Updated")
        return updated_challenge
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update user challenge: {str(e)}")


@challenge_router.patch("/GeographicChallenges/{challenge_id}", response_model=GeographicChallenge)
async def patch_challenge(challenge_id: str, challenge: GeographicChallenge):
    try:
        updated_challenge = await db_service.db.geographic_challenges.find_one_and_update({"id": challenge_id}, {"$set": challenge.model_dump()})
        if updated_challenge is None:
            raise HTTPException(status_code=404, detail="Challenge not found")
        logger.info(f"GeographicChallenge {challenge_id} Updated")
        return updated_challenge
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update geographic challenge: {str(e)}")

@challenge_router.delete("/Challenges/{challenge_id}", response_model=str)
async def delete_challenge(challenge_id: str):
    try:
        deleted_challenge = await db_service.db.challenges.find_one_and_delete({"id": challenge_id})
        if deleted_challenge is None:
            raise HTTPException(status_code=404, detail="Challenge not found")
        logger.info(f"Challenge {challenge_id} deleted")
        return "Challenge deleted"
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete challenge: {str(e)}")


@challenge_router.delete("/TeamChallenges/{challenge_id}", response_model=str)
async def delete_team_challenge(challenge_id: str):
    try:
        deleted_challenge = await db_service.db.team_challenges.find_one_and_delete({"id": challenge_id})
        if deleted_challenge is None:
            raise HTTPException(status_code=404, detail="TeamChallenge not found")
        logger.info(f"TeamChallenge {challenge_id} deleted")
        return "TeamChallenge deleted"
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete team challenge: {str(e)}")


@challenge_router.delete("/UserChallenges/{challenge_id}", response_model=str)
async def delete_user_challenge(challenge_id: str):
    try:
        deleted_challenge = await db_service.db.user_challenges.find_one_and_delete({"id": challenge_id})
        if deleted_challenge is None:
            raise HTTPException(status_code=404, detail="UserChallenge not found")
        logger.info(f"UserChallenge {challenge_id} deleted")
        return "UserChallenge deleted"
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete user challenge: {str(e)}")


@challenge_router.delete("/GeographicChallenges/{challenge_id}", response_model=str)
async def delete_geographic_challenge(challenge_id: str):
    try:
        deleted_challenge = await db_service.db.geographic_challenges.find_one_and_delete({"id": challenge_id})
        if deleted_challenge is None:
            raise HTTPException(status_code=404, detail="GeographicChallenge not found")
        logger.info(f"GeographicChallenge {challenge_id} deleted")
        return "GeographicChallenge deleted"
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete geographic challenge: {str(e)}")
