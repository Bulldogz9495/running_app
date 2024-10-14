from app.models.run import Run
from app.services.mongodb_service import MongoDBService
import reverse_geocoder as rg
from app.settings import logger

async def add_run_to_state_challenge(inserted_run: Run):
    """
    Add a run to the state challenge for the state where the run took place
    """
    db_service = MongoDBService()
    geopoint = inserted_run.start_location
    state_data = rg.search((geopoint.latitude, geopoint.longitude))[0]
    if state_data is None:
        return
    if state_data['cc'] != 'US':
        logger.info(f"Only implemented for US states")
        return
    session = await db_service.client.start_session()
    try:
        session.start_transaction()
        state_challenge = await db_service.db.geographic_challenges.find_one({"geography": state_data['admin1'], "active": True})
        if state_challenge is not None:
            await db_service.db.geographic_challenges.update_one({"id": state_challenge['id']}, {"$addToSet": {"runs": inserted_run.id}})
            logger.info(f"Run {inserted_run.id} added to state challenge {state_challenge['id']} for state {state_data['admin1']}")
        else:
            logger.info(f"No state challenge found for state {state_data['admin1']}")
        await session.commit_transaction()
    except Exception as e:
        await session.abort_transaction()
        logger.error(e)
