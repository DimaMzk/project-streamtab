import constants
import json
import key_manager

def is_authorized(message):
    if not constants.CONFIG["PASSWORD_REQUIRED"]:
        return True
    if "PASSWORD" not in message:
        print("No Password in message")
        return False
    if message["PASSWORD"] == constants.CONFIG["PASSWORD"]:
        return True
    print("[ERROR] : Unhandled Authorization Case")
    return False


def handle_initial_connection():
    if constants.CONFIG["PASSWORD_REQUIRED"]:
        return json.dumps(constants.AUTH_REQUIRED)
    return json.dumps(constants.CONNECTION_CONFIRMED)


def handle_authentication_message(decoded_message):
    if is_authorized(decoded_message):
        return json.dumps(constants.CONNECTION_CONFIRMED)
    return json.dumps(constants.AUTH_REQUIRED)


def handle_request_message(decoded_message):
    if not is_authorized(decoded_message):
        return json.dumps(constants.AUTH_REQUIRED)
    if ("request_type" in decoded_message) and (decoded_message["request_type"] == constants.PAGE_INFO):
        json_data = constants.PAGES[decoded_message["page_id"]]
        return json.dumps(json_data)
    print("[ERROR] : Unhandled Request Type")
    return json.dumps(constants.GENERAL_ERROR)


def handle_holddown_macro_message(decoded_message):
    if "hold_down_type" not in decoded_message:
        print("[ERROR]: Unknown Holddown Type")
        return json.dumps(constants.GENERAL_ERROR)
    if decoded_message["hold_down_type"] == constants.PRESS:
        status = key_manager.press_and_hold(decoded_message["id"])
        if status:
            msg = {"type": "macro_success", "success_type": "press_and_hold",
                   "id": decoded_message["id"], "location": decoded_message["location"]}
            return json.dumps(msg)
        else:
            msg = {
                "type": "macro_error", "id": decoded_message["id"], "location": decoded_message["location"]}
            return json.dumps(msg)

    if decoded_message["hold_down_type"] == constants.RELEASE:
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
    return json.dumps(constants.GENERAL_ERROR)


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
        return json.dumps(constants.AUTH_REQUIRED)
    if ("hold_down" not in decoded_message) or ("id" not in decoded_message) or ("location" not in decoded_message):
        print("[ERROR] : Malformed Macro Request")
        return json.dumps(constants.GENERAL_ERROR)

    if decoded_message["hold_down"] is True:
        return handle_holddown_macro_message(decoded_message)

    if decoded_message["hold_down"] is False:
        return handle_button_macro_message(decoded_message)

    print("[ERROR] : Unhandled Macro Request")
    return json.dumps(constants.GENERAL_ERROR)
