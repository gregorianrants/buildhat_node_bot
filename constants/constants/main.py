import os
from pathlib import Path
import json

cwd = os.getcwd()


mypath = os.path.join(os.path.dirname(__file__), "../" "SOCKETS.json")

from random import randrange

SOCKETS = None

with open(mypath, "r") as SOCKETS_FILE:
    SOCKETS = json.loads(SOCKETS_FILE.read())
