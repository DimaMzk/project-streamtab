from pynput.keyboard import Key, Controller
keyboard = Controller()

KEY_DICT = {
    "alt": Key.alt,  # Alt Key
    "backspace": Key.backspace,  # Backspace
    "caps_lock": Key.caps_lock,  # Capslock
    "cmd": Key.cmd,  # Windows: Win, # Linux / MacOS: Super
    "ctrl": Key.ctrl,  # Control
    "delete": Key.delete,  # Del
    "down": Key.down,  # Down Arrow
    "end": Key.end,  # End
    "enter": Key.enter,  # Enter/ Return Key
    "esc": Key.esc,  # Escape key
    "f1": Key.f1,  # F1 - F20
    "f2": Key.f2,
    "f3": Key.f3,
    "f4": Key.f4,
    "f5": Key.f5,
    "f6": Key.f6,
    "f7": Key.f7,
    "f8": Key.f8,
    "f9": Key.f9,
    "f10": Key.f10,
    "f11": Key.f11,
    "f12": Key.f12,
    "f13": Key.f13,
    "f14": Key.f14,
    "f15": Key.f15,
    "f16": Key.f16,
    "f17": Key.f17,
    "f18": Key.f18,
    "f19": Key.f19,
    "f20": Key.f20,
    "home": Key.home,  # Home Key
    "insert": Key.insert,  # Insert Key
    "left": Key.left,  # Left Arrow Key
    "media_next": Key.media_next,  # Next Track Button
    "media_play_pause": Key.media_play_pause,  # Play Pause Button
    "media_previous": Key.media_previous,  # Previous Track Button
    "media_volume_down": Key.media_volume_down,  # Volume down button
    "media_volume_mute": Key.media_volume_mute,  # Mute Button
    "media_volume_up": Key.media_volume_up,  # Volume Up Button
    "menu": Key.menu,  # Menu Key (could be undefined in some platforms)
    # Number Lock key (could be undefined in some platforms)
    "num_lock": Key.num_lock,
    "page_down": Key.page_down,  # Page down button
    "page_up": Key.page_up,  # Page Up
    # Pause/Break button (Could be undefined in some platforms)
    "pause": Key.pause,
    # Print Screen Button (Could be undefined in some platforms)
    "print_screen": Key.print_screen,
    "right": Key.right,  # Right Arrow Key
    "scroll_lock": Key.scroll_lock,  # Scroll Lock Button
    "shift": Key.shift,  # Shift button
    "space": Key.space,  # Space Button
    "tab": Key.tab,  # Tab Button
    "up": Key.up  # Up Arrow Button

}


def key_down(key):
    # Convert string to actual key object and do key_down
    key = str.lower(key)
    if len(key) > 1: # Special Keys
        keyboard.press(KEY_DICT[key])
    else: # Every Other Key
        keyboard.press(key)


def key_up(key):
    # Convert string to actual key object and do key_down
    key = str.lower(key)
    if len(key) > 1: # Special Keys
        keyboard.release(KEY_DICT[key])
    else: # Every Other Key
        keyboard.release(key)