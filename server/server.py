import asyncio
import websockets
from pynput.keyboard import Key, Controller

keyboard = Controller()

def handle_macro(num):
    num = int(num)
    if (num < 1 or num > 20):
        return -1 # Invalid Macrokey
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
    


async def echo(websocket, path):
    async for message in websocket:
        print(message)
        if(message[0:2] != "mk"):
            await websocket.send("Invalid MK")
            continue
        macronum = message[2:]
        status = handle_macro(macronum)
        if(status != 0):
            await websocket.send("An Error Occured - " + message )
            continue
        await websocket.send("success - " + message )

asyncio.get_event_loop().run_until_complete(
    websockets.serve(echo, '0.0.0.0', 8765))
asyncio.get_event_loop().run_forever()