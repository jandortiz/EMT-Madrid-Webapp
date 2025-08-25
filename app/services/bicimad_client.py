# Module responsible for manage the connection to EMT-Madrid API.
import os
import json
import requests
from dotenv import load_dotenv
from db.redis import redis_client


env_path = os.path.join("core", ".env")
load_dotenv(env_path)


def get_access_token() -> dict:
    """Make a connection to the EMT-Madrid API to get the access user token.

    Returns:
        Dictionary with the access token string connection.

    """
    url_login = "https://openapi.emtmadrid.es/v3/mobilitylabs/user/login/"

    header = {
        "Content-Type": "application/json",
        "X-ClientId": f"{os.getenv('X_CLIENT_ID')}",
        "passkey": f"{os.getenv('PASSKEY')}"
    }

    response = requests.get(url=url_login, headers=header)
    response_json = response.json()

    token_str = response_json['data'][0]['accessToken']

    return {"accessToken": token_str}


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
