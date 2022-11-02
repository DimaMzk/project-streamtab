import asyncio
import websockets
import json
import message_handler
import constants
import socket


def get_ip_address():
    h_name = socket.gethostname()
    return socket.gethostbyname(h_name)


def print_connection_info():
    print("Server running on port " + str(constants.CONFIG["PORT"]))
    print("Navigate to http://streamtab.dmaizik.ca/webclient/?ip=" +
          get_ip_address() + "&port=" + str(constants.CONFIG["PORT"]) + " on a different device on the same network")


# Path is apparently Required TODO: Find out why
async def echo(websocket, path):
    async for message in websocket:
        decoded_message = json.loads(message)
        pretty = json.dumps(decoded_message, indent=4)
        print(pretty)
        print('-----------------')

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

if __name__ == '__main__':
    print("Starting Server")
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        start_server = websockets.serve(
            echo,  '0.0.0.0', constants.CONFIG["PORT"])
        print_connection_info()
        loop.run_until_complete(start_server)
        loop.run_forever()
    except KeyboardInterrupt:
        print("Keyboard Interrupt")
        loop.close()
        pass
