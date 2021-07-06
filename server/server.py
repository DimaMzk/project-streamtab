import asyncio
import websockets
import json
from websockets import auth
from websockets.http import d
import message_handler
import constants

# Path is apparently Required TODO: Find out why
async def echo(websocket, path):
    async for message in websocket:
        decoded_message = json.loads(message)
        print(decoded_message)

        # Ensure Message Type Exists
        if "type" not in decoded_message:
            continue

        # INITIAL CONNECTION
        if decoded_message["type"] == constants.INITIAL_CONNECTION:
            await websocket.send(message_handler.handle_initial_connection())
            continue

        # AUTHENTICATION
        if decoded_message["type"] == constants.AUTHENTICATION:
            await websocket.send(message_handler.handle_authentication_message(decoded_message))
            continue

        # REQUEST
        if decoded_message["type"] == constants.REQUEST:
            await websocket.send(message_handler.handle_request_message(decoded_message))
            continue

        # MACRO
        if decoded_message["type"] == constants.MACRO:
            await websocket.send(message_handler.handle_macro_message(decoded_message))
            continue

        print("[ERROR] : Unhandled Message")

asyncio.get_event_loop().run_until_complete(
    websockets.serve(echo, '0.0.0.0', constants.CONFIG["PORT"]))
asyncio.get_event_loop().run_forever()
