# Module responsible for manage the connection to EMT-Madrid API.
import json
import requests
from db.redis import redis_client
from services.access_token import get_access_token


access_header = get_access_token()


def get_bicis_station_info() -> list[dict]:
    """Make a connection to the endpoint: transport/bicimad/stations/ to get
    data from Madrid bicycle stations.

    Returns:
        A list with all the information relative to every bicycle station.
    """
    url_stations = "https://openapi.emtmadrid.es/v1/transport/bicimad/stations/"

    cached_data = redis_client.get("bicimad:availability")

    if cached_data:
        print("Data from Redis.")
        data = json.loads(cached_data)
        return data
    else:
        print("Data from EMT API.")
        response = requests.get(url=url_stations, headers=access_header)
        response_json = response.json()

        data = response_json['data']
        redis_client.set("bicimad:availability", json.dumps(data), ex=120)
        return data
