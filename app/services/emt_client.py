import json
import requests
from services.access_token import get_access_token


access_header = get_access_token()

def get_stop_around_geographical_point() -> list[dict]:
    """Make a connection to the endpoint: transport/bicimad/stations/ to get
    data from Madrid bicycle stations.

    Returns:
        A list with all the information relative to every bicycle station.
    """
    lat = 40.41521
    long = -3.69191
    radius = 300
    url_stations = f"https://openapi.emtmadrid.es/v2/transport/busemtmad/stops/arroundxy/{long}/{lat}/{radius}/"

    response = requests.get(url=url_stations, headers=access_header)
    response_json = response.json()
    data = response_json['data']
    
    return data
