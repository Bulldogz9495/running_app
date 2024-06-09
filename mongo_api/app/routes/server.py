from fastapi import APIRouter, HTTPException
from app.services.mongodb_service import MongoDBService
from fastapi.security import OAuth2PasswordBearer
from fastapi import APIRouter, HTTPException, Depends

db_service = MongoDBService()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/token")

server_router = APIRouter()

@server_router.get("/health")
async def health():
    return {"status": "ok"}


@server_router.delete("/delete_all")
async def delete_all_collections(token: str = Depends(oauth2_scheme)):
    collection_names = await db_service.db.list_collection_names()
    for collection_name in collection_names:
        await db_service.db[collection_name].drop()
    logger.info("All collections deleted")
    return {"message": "All collections deleted"}