import reverse_geocoder as rg
from app.services.mongodb_service import MongoDBService
from datetime import datetime
from app.services.mongodb_service import MongoDBService
from app.settings import logger
import uuid


async def finish_Create_challenges():
    logger.info(f"Finish and Recreate Challenges Task: Starting {datetime.now()}")
    await finish_create_personal_challenges()
    await finish_create_team_challenges()
    await finish_create_geographic_challenges()
    await finish_create_user_challenges()
    # collection.update_one({"key": "value"}, {"$set": {"field": "new value"}})
    logger.info(f"Finish and Recreate Challenges Task: Finishing {datetime.now()}")
    

async def finish_create_personal_challenges():
    db_service = MongoDBService()
    challenges = db_service.db.challenges.find({"active": True})
    async for challenge in challenges:
        if challenge["end_datetime"] < datetime.now():
            challenge["active"] = False
            db_service.db.challenges.update_one({"id": challenge["id"]},{"$set": {"active": False}})
            if challenge["repeat"]:
                challenge_repeat = challenge
                challenge_repeat["active"] = True
                challenge_repeat["id"] = uuid.uuid4()
                challenge_repeat["start_datetime"] = challenge["end_datetime"] + datetime.timedelta(days=1)
                challenge_repeat["end_datetime"] = challenge_repeat["start_datetime"] + (challenge["end_datetime"] - challenge["start_datetime"])
                challenge_repeat.pop("_id")
                db_service.db.challenges.insert_one(challenge_repeat)
                logger.info(f"Challenge {challenge_repeat['id']} created at {datetime.now()}: repeat of {challenge['id']}")
            else:
                logger.info(f"Challenge {challenge['id']} ended at {datetime.now()}")
                

async def finish_create_team_challenges():
    db_service = MongoDBService()
    challenges = db_service.db.team_challenges.find({"active": True})
    async for challenge in challenges:
        if challenge["end_datetime"] < datetime.now():
            challenge["active"] = False
            db_service.db.team_challenges.update_one({"id": challenge["id"]},{"$set": {"active": False}})
            if challenge["repeat"]:
                challenge_repeat = challenge
                challenge_repeat["active"] = True
                challenge_repeat["id"] = uuid.uuid4()
                challenge_repeat["start_datetime"] = datetime.now()
                challenge_repeat["end_datetime"] = challenge_repeat["start_datetime"] + (challenge["end_datetime"] - challenge["start_datetime"])
                challenge_repeat.pop("_id")
                db_service.db.team_challenges.insert_one(challenge_repeat)
                logger.info(f"Team Challenge {challenge_repeat['id']} created at {datetime.now()}: repeat of {challenge['id']}")
            else:
                logger.info(f"Team Challenge {challenge['id']} ended at {datetime.now()}")


async def finish_create_geographic_challenges():
    db_service = MongoDBService()
    challenges = db_service.db.geographic_challenges.find({"active": True})
    async for challenge in challenges:
        if challenge["end_datetime"] < datetime.now():
            challenge["active"] = False
            db_service.db.geographic_challenges.update_one({"id": challenge["id"]},{"$set": {"active": False}})
            if challenge["repeat"]:
                challenge_repeat = challenge
                challenge_repeat["active"] = True
                challenge_repeat["id"] = uuid.uuid4()
                challenge_repeat["start_datetime"] = datetime.now()
                challenge_repeat["end_datetime"] = challenge_repeat["start_datetime"] + (challenge["end_datetime"] - challenge["start_datetime"])
                challenge_repeat.pop("_id")
                db_service.db.geographic_challenges.insert_one(challenge_repeat)
                logger.info(f"Geographic Challenge {challenge_repeat['id']} created at {datetime.now()}: repeat of {challenge['id']}")
            else:
                logger.info(f"Geographic Challenge {challenge['id']} ended at {datetime.now()}")


async def finish_create_user_challenges():
    db_service = MongoDBService()
    challenges = db_service.db.user_challenges.find({"active": True})
    async for challenge in challenges:
        if challenge["end_datetime"] < datetime.now():
            challenge["active"] = False
            db_service.db.user_challenges.update_one({"id": challenge["id"]},{"$set": {"active": False}})
            if challenge["repeat"]:
                challenge_repeat = challenge
                challenge_repeat["active"] = True
                challenge_repeat["id"] = uuid.uuid4()
                challenge_repeat["start_datetime"] = datetime.now()
                challenge_repeat["end_datetime"] = challenge_repeat["start_datetime"] + (challenge["end_datetime"] - challenge["start_datetime"])
                challenge_repeat.pop("_id")
                db_service.db.user_challenges.insert_one(challenge_repeat)
                logger.info(f"User Challenge {challenge_repeat['id']} created at {datetime.now()}: repeat of {challenge['id']}")
            else:
                logger.info(f"User Challenge {challenge['id']} ended at {datetime.now()}")