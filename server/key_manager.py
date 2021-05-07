import keys
import config_loader

# Load Config Files 
CONFIG = config_loader.read_config_file()
PAGES, MACROS = config_loader.read_pages_and_macros_file()

def press_and_hold(macro_id):
    if macro_id not in MACROS:
        return False
    try:
        # Press Down All Buttons
        for button in MACROS[macro_id]["buttons"]:
            keys.key_down(button)
    except Exception:
        return False
    return True

def release(macro_id):
    if macro_id not in MACROS:
        return False
    try:
        # Press Down All Buttons
        for button in MACROS[macro_id]["buttons"]:
            keys.key_up(button)
    except Exception:
        return False

    return True


def press(macro_id):
    if macro_id not in MACROS:
        return False
    try:
        # Press Down All Buttons
        for button in MACROS[macro_id]["buttons"]:
            keys.key_down(button)
        # Release All Buttons
        for button in MACROS[macro_id]["buttons"]:
            keys.key_up(button)
    except Exception:
        return False
    return True