import os
import requests
from dotenv import load_dotenv

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
    print(response_json)
    token_str = response_json['data'][0]['accessToken']

    return {"accessToken": token_str}