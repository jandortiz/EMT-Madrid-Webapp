from fastapi import APIRouter
from services.emt_client import get_stop_around_geographical_point

emt_router = APIRouter()

@emt_router.get("/emt/stops")
async def get_stops_around_point():
    return get_stop_around_geographical_point()
