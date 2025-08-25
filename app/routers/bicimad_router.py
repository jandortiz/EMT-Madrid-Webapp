# Module responsible for manage requests to the endpoint /bicimadrid.
from fastapi import APIRouter
from models.bicimad_stations import StationAvailability
from services.bicimad_client import get_bicis_station_info


router = APIRouter()

@router.get("/bicimad/latest", response_model=list[StationAvailability])
async def get_bicimad_info():
    return get_bicis_station_info()