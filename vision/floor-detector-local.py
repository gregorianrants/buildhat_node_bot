import vision.floor_detector
import numpy as np
import cv2

flood = vision.floor_detector.flood

import sys
import zmq

# import cv2
# import numpy as np


#  Socket to talk to server
context = zmq.Context()
socket = context.socket(zmq.SUB)
socket.connect("ipc://@camera")
socket.setsockopt(zmq.SUBSCRIBE, b"")
socket.setsockopt(zmq.CONFLATE, 1)

pub_socket = context.socket(zmq.PUB)
pub_socket.bind(f"tcp://*:5558")


while True:
    received_bytes = socket.recv()
    # print(received_bytes)
    np_array = np.frombuffer(received_bytes, dtype=np.uint8)
    image = cv2.imdecode(np_array, 1)
    image, _, _ = flood(image)
    jpeg = cv2.imencode(".jpg", image)
    pub_socket.send(jpeg)
# cv2.imshow("image", image)
# cv2.waitKey(1)
