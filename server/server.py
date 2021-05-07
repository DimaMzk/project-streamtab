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
            if is_authorized(decoded_message):
                await websocket.send(json.dumps(CONNECTION_CONFIRMED))
                continue
            await websocket.send(json.dumps(AUTH_REQUIRED))
            continue

        # REQUEST
        if decoded_message["type"] == REQUEST:
            if not is_authorized(decoded_message):
                continue
            if ("request_type" in decoded_message) and (decoded_message["request_type"] == PAGE_INFO):
                json_data = PAGES[decoded_message["page_id"]]
                await websocket.send(json.dumps(json_data))
                continue
            print("[ERROR] : Unhandled Request Type")
            continue

        # MACRO
        if decoded_message["type"] == MACRO:
            if not is_authorized(decoded_message):
                continue
            if ("hold_down" not in decoded_message) and ("id" not in decoded_message) and ("location" not in decoded_message):
                print("[ERROR] : Malformed Macro Request")
                continue

            if decoded_message["hold_down"] is True:
                if "hold_down_type" not in decoded_message:
                    print("[ERROR]: Unknown Holddown Type")
                    continue
                if decoded_message["hold_down_type"] == PRESS:
                    status = key_manager.press_and_hold(decoded_message["id"])
                    if status:
                        msg = {"type": "macro_success", "success_type": "press_and_hold",
                               "id": decoded_message["id"], "location": decoded_message["location"]}
                        await websocket.send(json.dumps(msg))
                    else:
                        msg = {
                            "type": "macro_error", "id": decoded_message["id"], "location": decoded_message["location"]}
                        await websocket.send(json.dumps(msg))
                    continue

                if decoded_message["hold_down_type"] == RELEASE:
                    status = key_manager.release(decoded_message["id"])
                    if status:
                        msg = {"type": "macro_success", "success_type": "release",
                               "id": decoded_message["id"], "location": decoded_message["location"]}
                        await websocket.send(json.dumps(msg))
                    else:
                        msg = {
                            "type": "macro_error", "id": decoded_message["id"], "location": decoded_message["location"]}
                        await websocket.send(json.dumps(msg))
                    continue
                print("[ERROR] : Unhandled HoldDown Type")
                continue

            if decoded_message["hold_down"] is False:
                status = key_manager.press(decoded_message["id"])
                if status:
                    msg = {"type": "macro_success", "success_type": "press",
                           "id": decoded_message["id"], "location": decoded_message["location"]}
                    await websocket.send(json.dumps(msg))
                else:
                    msg = {"type": "macro_error",
                           "id": decoded_message["id"], "location": decoded_message["location"]}
                    await websocket.send(json.dumps(msg))
                continue

            print("[ERROR] : Unhandled Macro Request")
            continue

        print("[ERROR] : Unhandled Message")

asyncio.get_event_loop().run_until_complete(
    websockets.serve(echo, '0.0.0.0', 8765))
asyncio.get_event_loop().run_forever()
