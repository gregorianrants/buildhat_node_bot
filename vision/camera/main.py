import io
import picamera
import time
import zmq
import os
from pathlib import Path
import sys

sys.path.append(
    "/home/pi/projects/buildhat_node_bot",
)

from build_hat_node_bot_shared.network_py.Publisher import Publisher


# address = registerPublisher(context, "tcp://192.168.178.52", "camera", "frame")

# socket = context.socket(zmq.PUB)
# # socket.bind(f'tcp://*:{SOCKETS["CAMERA"]}')
# # socket.bind(f"ipc://@camera")

# socket.bind(address)
context = zmq.Context()
publisher = Publisher(
    context=context, address="tcp://192.168.178.52", node="camera", topic="frame"
)

stream = io.BytesIO()


with picamera.PiCamera() as camera:
    camera.resolution = (640, 480)
    camera.framerate = 24
    time.sleep(2)

    for foo in camera.capture_continuous(stream, "jpeg", use_video_port=True):
        # return current frame
        stream.seek(0)
        result = stream.read()
        publisher.send_bytes(result)
        # reset stream for next frame
        stream.seek(0)
        stream.truncate()
