import os
from pathlib import Path
import json

cwd = os.getcwd()

mypath = os.path.join(cwd, "../", "SOCKETS.json")

print(os.path.abspath(mypath))


from random import randrange

SOCKETS = None

with open("../SOCKETS.json", "r") as SOCKETS_FILE:
    SOCKETS = json.loads(SOCKETS_FILE.read())
