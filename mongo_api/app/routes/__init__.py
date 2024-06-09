from fastapi import APIRouter, Depends, HTTPException

from app.models.user import Token
router = APIRouter()

from app.routes.teams import team_router
router.include_router(team_router)

from app.routes.users import user_router
router.include_router(user_router)

from app.routes.server import server_router
router.include_router(server_router)

from app.routes.runs import run_router
router.include_router(run_router)