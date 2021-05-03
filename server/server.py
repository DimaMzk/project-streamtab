import asyncio
from enum import auto
import websockets
import json
import enum
from pynput.keyboard import Key, Controller
from websockets import auth
from websockets.http import d

PASSWORD = "PASSWORD123"  # TODO: Not Have Hardcoded.
PASSWORD_REQUIRED = True

# Message Types


class MessageType(enum.Enum):
    INITIAL_CONNECTION = "initial_connection"
    AUTHENTICATION = 'auth'
    REQUEST = 'request'
    MACRO = 'macro'


class ReplyType(enum.Enum):
    AUTH_REQUIRED = {"type": "authentication_required"}
    CONNECTION_CONFIRMED = {"type": "connection_confirmed"}


class RequestType(enum.Enum):
    PAGE_INFO = 'page_info'

class HolddownType(enum.Enum):
    PRESS = 'press'
    RELEASE = 'release'


authenticated = False

keyboard = Controller()


def handle_macro(num):
    num = int(num)
    if (num < 1 or num > 20):
        return -1  # Invalid Macrokey
    keyboard.press(Key.ctrl)
    keyboard.press(Key.shift)
    if(num == 1):
        keyboard.press(Key.f1)
        keyboard.release(Key.f1)
    if(num == 2):
        keyboard.press(Key.f2)
        keyboard.release(Key.f2)
    if(num == 3):
        keyboard.press(Key.f3)
        keyboard.release(Key.f3)
    if(num == 4):
        keyboard.press(Key.f4)
        keyboard.release(Key.f4)
    if(num == 5):
        keyboard.press(Key.f5)
        keyboard.release(Key.f5)
    if(num == 6):
        keyboard.press(Key.f6)
        keyboard.release(Key.f6)
    if(num == 7):
        keyboard.press(Key.f7)
        keyboard.release(Key.f7)
    if(num == 8):
        keyboard.press(Key.f8)
        keyboard.release(Key.f8)
    if(num == 9):
        keyboard.press(Key.f9)
        keyboard.release(Key.f9)
    if(num == 10):
        keyboard.press(Key.f10)
        keyboard.release(Key.f10)
    if(num == 11):
        keyboard.press(Key.f11)
        keyboard.release(Key.f11)
    if(num == 12):
        keyboard.press(Key.f12)
        keyboard.release(Key.f12)
    if(num == 13):
        keyboard.press(Key.f13)
        keyboard.release(Key.f13)
    if(num == 14):
        keyboard.press(Key.f14)
        keyboard.release(Key.f14)
    if(num == 15):
        keyboard.press(Key.f15)
        keyboard.release(Key.f15)
    if(num == 16):
        keyboard.press(Key.f16)
        keyboard.release(Key.f16)
    if(num == 17):
        keyboard.press(Key.f17)
        keyboard.release(Key.f17)
    if(num == 18):
        keyboard.press(Key.f18)
        keyboard.release(Key.f18)
    if(num == 19):
        keyboard.press(Key.f19)
        keyboard.release(Key.f19)
    if(num == 20):
        keyboard.press(Key.f20)
        keyboard.release(Key.f20)
    keyboard.release(Key.ctrl)
    keyboard.release(Key.shift)
    return 0


def is_authorized(message):
    if not PASSWORD_REQUIRED:
        return True
    if not message["PASSWORD"]:
        return False
    if message["PASSWORD"] == PASSWORD:
        return True
    print("[ERROR] : Unhandled Authorization Case")
    return False

def press_and_hold(macro_id):
    return True

def release(macro_id):
    return True

def press(macro_id):
    # TODO: This is based on the dummy data generated on line 166
    #   When a mechanism to store macro data is created, this and the other two functions
    #   should look up the macro_id, and press keyboard button based off of this.

    if macro_id == 12345:
        keyboard.press(Key.ctrl)
        keyboard.press(Key.shift)
        keyboard.press(Key.f1)
        keyboard.release(Key.ctrl)
        keyboard.release(Key.shift)
        keyboard.release(Key.f1)
    
    if macro_id == 12346:
        keyboard.press(Key.ctrl)
        keyboard.press(Key.shift)
        keyboard.press(Key.f5)
        keyboard.release(Key.ctrl)
        keyboard.release(Key.shift)
        keyboard.release(Key.f5)
    
    if macro_id == 12347:
        keyboard.press(Key.ctrl)
        keyboard.press(Key.shift)
        keyboard.press(Key.f5)
        keyboard.release(Key.ctrl)
        keyboard.release(Key.shift)
        keyboard.release(Key.f6)

    if macro_id == 12348:
        keyboard.press(Key.ctrl)
        keyboard.press(Key.shift)
        keyboard.press(Key.f11)
        keyboard.release(Key.ctrl)
        keyboard.release(Key.shift)
        keyboard.release(Key.f11)
    
    if macro_id == 12349:
        keyboard.press(Key.ctrl)
        keyboard.press(Key.shift)
        keyboard.press(Key.f12)
        keyboard.release(Key.ctrl)
        keyboard.release(Key.shift)
        keyboard.release(Key.f12)

    return False

async def echo(websocket, path):
    async for message in websocket:
        global authenticated
        decoded_message = json.loads(message)
        print(decoded_message)

        # Ensure Message Type Exists
        if not decoded_message["type"]:
            continue

        # INITIAL CONNECTION
        if decoded_message["type"] == MessageType.INITIAL_CONNECTION:
            if PASSWORD_REQUIRED:
                await websocket.send(json.dumps(ReplyType.AUTH_REQUIRED))
                continue
            await websocket.send(json.dumps(ReplyType.CONNECTION_CONFIRMED))
            continue

        # AUTHENTICATION
        if decoded_message["type"] == MessageType.AUTHENTICATION:
            if is_authorized(decoded_message):
                await websocket.send(json.dumps(ReplyType.CONNECTION_CONFIRMED))
                continue
            await websocket.send(json.dumps(ReplyType.AUTH_REQUIRED))
            continue

        # REQUEST
        if decoded_message["type"] == MessageType.REQUEST:
            if not is_authorized(decoded_message):
                continue
            if decoded_message["request_type"] and decoded_message["request_type"] == RequestType.PAGE_INFO:
                # TODO: Generate JSON Data
                # TODO: Have Mechanism To Store data to Generate JSON Data With

                # DUMMY DATA
                json_data = {
                    "type": "page_data",
                    "page_id": "home",
                    "a1": {"type": "macro", "name": "Google Assistant", "id": 12345, "image": "undefined", "hold_down": False},
                    "a2": {"type": "unassigned"},
                    "a3": {"type": "unassigned"},
                    "a4": {"type": "unassigned"},
                    "a5": {"type": "macro", "name": "Discord Deafen", "id": 12346, "image": "undefined", "hold_down": False},
                    "a6": {"type": "macro", "name": "Discord Mute", "id": 12347, "image": "undefined", "hold_down": False},
                    "b1": {"type": "unassigned"},
                    "b2": {"type": "unassigned"},
                    "b3": {"type": "unassigned"},
                    "b4": {"type": "unassigned"},
                    "b5": {"type": "macro", "name": "Zoom Toggle Video", "id": 12348, "image": "undefined", "hold_down": False},
                    "b6": {"type": "macro", "name": "Zoom Mute", "id": 12349, "image": "undefined", "hold_down": False},
                    "c1": {"type": "unassigned"},
                    "c2": {"type": "unassigned"},
                    "c3": {"type": "unassigned"},
                    "c4": {"type": "unassigned"},
                    "c5": {"type": "unassigned"},
                    "c6": {"type": "unassigned"},
                    "d1": {"type": "unassigned"},
                    "d2": {"type": "unassigned"},
                    "d3": {"type": "unassigned"},
                    "d4": {"type": "unassigned"},
                    "d5": {"type": "unassigned"},
                    "d6": {"type": "unassigned"}
                }
                await websocket.send(json.dumps(json_data))
                continue
            
            print("[ERROR] : Unhandled Request Type")
            continue

        # MACRO
        if decoded_message["type"] == MessageType.MACRO:
            if not is_authorized(decoded_message):
                continue

            if not decoded_message["hold_down"] and not decoded_message["id"] and not decoded_message["location"]:
                print("[ERROR] : Malformed Macro Request")
                continue
            
            if decoded_message["hold_down"] is True:
                if not decoded_message["hold_down_type"]:
                    print("[ERROR]: Unknown Holddown Type")
                    continue
                
                if decoded_message["hold_down_type"] == HolddownType.PRESS:
                    status = press_and_hold(decoded_message["id"])
                    if status:
                        msg = {"type": "macro_success", "success_type": "press_and_hold", "id": decoded_message["id"], "location": decoded_message["location"]}
                        await websocket.send(json.dumps(msg))
                    else:
                        msg = {"type": "macro_error", "id": decoded_message["id"], "location": decoded_message["location"]}
                        await websocket.send(json.dumps(msg))
                    continue
            
                if decoded_message["hold_down_type"] == HolddownType.RELEASE:
                    status = release(decoded_message["id"])
                    if status:
                        msg = {"type": "macro_success", "success_type": "release", "id": decoded_message["id"], "location": decoded_message["location"]}
                        await websocket.send(json.dumps(msg))
                    else:
                        msg = {"type": "macro_error", "id": decoded_message["id"], "location": decoded_message["location"]}
                        await websocket.send(json.dumps(msg))
                    continue

                print("[ERROR] : Unhandled HoldDown Type")
                continue

            if decoded_message["hold_down"] is False:
                status = press(decoded_message["id"])
                if status:
                    msg = {"type": "macro_success", "success_type": "press", "id": decoded_message["id"], "location": decoded_message["location"]}
                    await websocket.send(json.dumps(msg))
                else:
                    msg = {"type": "macro_error", "id": decoded_message["id"], "location": decoded_message["location"]}
                    await websocket.send(json.dumps(msg))
                continue

            print("[ERROR] : Unhandled Macro Request")
            continue
        
        print("[ERROR] : Unhandled Message")

asyncio.get_event_loop().run_until_complete(
    websockets.serve(echo, '0.0.0.0', 8765))
asyncio.get_event_loop().run_forever()
