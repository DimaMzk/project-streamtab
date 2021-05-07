import asyncio
import websockets
import json
from websockets import auth
from websockets.http import d
import key_manager
import config_loader

# Load Config Files 
CONFIG = config_loader.read_config_file()
PAGES, MACROS = config_loader.read_pages_and_macros_file()

# Message Types
INITIAL_CONNECTION = "initial_connection"
AUTHENTICATION = 'auth'
REQUEST = 'request'
MACRO = 'macro'

# Reply Types
AUTH_REQUIRED = {"type": "authentication_required"}
CONNECTION_CONFIRMED = {"type": "connection_confirmed"}
GENERAL_ERROR = {"type": "general_error"}

# Request Types
PAGE_INFO = 'page_info'

# Holddown Types
PRESS = 'press'
RELEASE = 'release'


def is_authorized(message):
    if not CONFIG["PASSWORD_REQUIRED"]:
        return True
    if "PASSWORD" not in message:
        print("No Pasword in message")
        return False
    if message["PASSWORD"] == CONFIG["PASSWORD"]:
        return True
    print("[ERROR] : Unhandled Authorization Case")
    return False


def handle_initial_connection():
    if CONFIG["PASSWORD_REQUIRED"]:
        return json.dumps(AUTH_REQUIRED)
    return json.dumps(CONNECTION_CONFIRMED)


def handle_authentication_message(decoded_message):
    if is_authorized(decoded_message):
        return json.dumps(CONNECTION_CONFIRMED)
    return json.dumps(AUTH_REQUIRED)


def handle_request_message(decoded_message):
    if not is_authorized(decoded_message):
        return json.dumps(AUTH_REQUIRED)
    if ("request_type" in decoded_message) and (decoded_message["request_type"] == PAGE_INFO):
        json_data = PAGES[decoded_message["page_id"]]
        return json.dumps(json_data)
    print("[ERROR] : Unhandled Request Type")
    return json.dumps(GENERAL_ERROR)


def handle_holddown_macro_message(decoded_message):
    if "hold_down_type" not in decoded_message:
        print("[ERROR]: Unknown Holddown Type")
        return json.dumps(GENERAL_ERROR)
    if decoded_message["hold_down_type"] == PRESS:
        status = key_manager.press_and_hold(decoded_message["id"])
        if status:
            msg = {"type": "macro_success", "success_type": "press_and_hold",
                    "id": decoded_message["id"], "location": decoded_message["location"]}
            return json.dumps(msg)
        else:
            msg = {
                "type": "macro_error", "id": decoded_message["id"], "location": decoded_message["location"]}
            return json.dumps(msg)

    if decoded_message["hold_down_type"] == RELEASE:
        status = key_manager.release(decoded_message["id"])
        if status:
            msg = {"type": "macro_success", "success_type": "release",
                    "id": decoded_message["id"], "location": decoded_message["location"]}
            return json.dumps(msg)
        else:
            msg = {
                "type": "macro_error", "id": decoded_message["id"], "location": decoded_message["location"]}
            return json.dumps(msg)
    print("[ERROR] : Unhandled HoldDown Type")
    return json.dumps(GENERAL_ERROR)


def handle_button_macro_message(decoded_message):
    status = key_manager.press(decoded_message["id"])
    if status:
        msg = {"type": "macro_success", "success_type": "press",
                "id": decoded_message["id"], "location": decoded_message["location"]}
        return json.dumps(msg)
    else:
        msg = {"type": "macro_error",
                "id": decoded_message["id"], "location": decoded_message["location"]}
        return json.dumps(msg)


def handle_macro_message(decoded_message):
    if not is_authorized(decoded_message):
        return json.dumps(AUTH_REQUIRED)
    if ("hold_down" not in decoded_message) and ("id" not in decoded_message) and ("location" not in decoded_message):
        print("[ERROR] : Malformed Macro Request")
        return json.dumps(GENERAL_ERROR)

    if decoded_message["hold_down"] is True:
        return handle_holddown_macro_message(decoded_message)

    if decoded_message["hold_down"] is False:
        return handle_button_macro_message(decoded_message)

    print("[ERROR] : Unhandled Macro Request")
    return json.dumps(GENERAL_ERROR)

async def echo(websocket, path):
    async for message in websocket:
        decoded_message = json.loads(message)
        print(decoded_message)

        # Ensure Message Type Exists
        if "type" not in decoded_message:
            continue

        # INITIAL CONNECTION
        if decoded_message["type"] == INITIAL_CONNECTION:
            await websocket.send(handle_initial_connection())
            continue

        # AUTHENTICATION
        if decoded_message["type"] == AUTHENTICATION:
            await websocket.send(handle_authentication_message(decoded_message))
            continue

        # REQUEST
        if decoded_message["type"] == REQUEST:
            await websocket.send(handle_request_message(decoded_message))
            continue

        # MACRO
        if decoded_message["type"] == MACRO:
            await websocket.send(handle_macro_message(decoded_message))
            continue

        print("[ERROR] : Unhandled Message")

asyncio.get_event_loop().run_until_complete(
    websockets.serve(echo, '0.0.0.0', 8765))
asyncio.get_event_loop().run_forever()
