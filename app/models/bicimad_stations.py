# Módulo que contiene la tabla 
from pydantic import BaseModel

class StationAvailability(BaseModel):
    activate: int
    address: str
    dock_bikes: int
    free_bases: int
    geofenced_capacity: int
    geometry: dict
    id: int
    light: int
    name: str
    no_available: int
    number: str
    reservations_count: int
    tipo_estacionPBSC: str
    total_bases: int
    total_bases: int
    virtualDelete: bool
    image: str