import io
import picamera
import time
import zmq


from random import randrange


context = zmq.Context()
socket = context.socket(zmq.PUB)
socket.bind("tcp://*:5556")

stream = io.BytesIO()

with picamera.PiCamera() as camera:
    camera.resolution = (640, 480)
    camera.framerate = 24
    time.sleep(2)

    for foo in camera.capture_continuous(stream, "jpeg", use_video_port=True):
        # return current frame
        stream.seek(0)
        result = stream.read()
        socket.send(result)

        # reset stream for next frame
        stream.seek(0)
        stream.truncate()
