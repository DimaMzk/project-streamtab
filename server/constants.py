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
GENERAL_ERROR = {"type": "general_error"}

# Request Types
PAGE_INFO = 'page_info'

# Holddown Types
PRESS = 'press'
RELEASE = 'release' 