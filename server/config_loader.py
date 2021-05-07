import json

def read_config_file():
    try:
        with open("./config.json") as config:
            return json.load(config)
    except FileNotFoundError:
        with open("./config.json", "w+") as config:
            print("[INFO] : config.json not found, creating new one with defaults")
            CONFIG = {"PASSWORD": "",
                    "PASSWORD_REQUIRED": False,
                    "USE_SECURE_PROTOCOL": False}
            json.dump(CONFIG, config, indent=2)
            return CONFIG

def read_pages_and_macros_file():
    """
    If one of the files is missing, the other becomes invalid, this we replace
        both even if only one is missing.
    """
    try:
        with open('./pages.json') as pages:
            PAGES = json.loads(pages.read())
        with open('./macros.json') as macros:
            MACROS = json.loads(macros.read())
        return PAGES, MACROS
    except FileNotFoundError:
        print("[INFO] : One of macros.json, or pages.json where not found, creating new ones with defaults")
        with open('./macros.json', "w+") as macros:
            MACROS = {}
            json.dump(MACROS, macros, indent=2)
        with open('./pages.json', "w+") as pages:
            PAGES = {"home": {
                "type": "page_data",
                "page_id": "home",
                "a1": { "type": "unassigned" },
                "a2": { "type": "unassigned" },
                "a3": { "type": "unassigned" },
                "a4": { "type": "unassigned" },
                "a5": { "type": "unassigned" },
                "a6": { "type": "unassigned" },
                "b1": { "type": "unassigned" },
                "b2": { "type": "unassigned" },
                "b3": { "type": "unassigned" },
                "b4": { "type": "unassigned" },
                "b5": { "type": "unassigned" },
                "b6": { "type": "unassigned" },
                "c1": { "type": "unassigned" },
                "c2": { "type": "unassigned" },
                "c3": { "type": "unassigned" },
                "c4": { "type": "unassigned" },
                "c5": { "type": "unassigned" },
                "c6": { "type": "unassigned" },
                "d1": { "type": "unassigned" },
                "d2": { "type": "unassigned" },
                "d3": { "type": "unassigned" },
                "d4": { "type": "unassigned" },
                "d5": { "type": "unassigned" },
                "d6": { "type": "unassigned" },
            }}
            json.dump(PAGES, pages, indent=2)
        return PAGES, MACROS
