import keys
import constants

def press_and_hold(macro_id):
    if macro_id not in constants.MACROS:
        return False
    try:
        # Press Down All Buttons
        for button in constants.MACROS[macro_id]["buttons"]:
            keys.key_down(button)
    except Exception:
        return False
    return True

def release(macro_id):
    if macro_id not in constants.MACROS:
        return False
    try:
        # Press Down All Buttons
        for button in constants.MACROS[macro_id]["buttons"]:
            keys.key_up(button)
    except Exception:
        return False

    return True


def press(macro_id):
    if macro_id not in constants.MACROS:
        return False
    try:
        # Press Down All Buttons
        for button in constants.MACROS[macro_id]["buttons"]:
            keys.key_down(button)
        # Release All Buttons
        for button in constants.MACROS[macro_id]["buttons"]:
            keys.key_up(button)
    except Exception:
        return False
    return True