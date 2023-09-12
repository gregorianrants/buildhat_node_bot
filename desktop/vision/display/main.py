import sys
import zmq
import cv2
import numpy as np


#  Socket to talk to server
context = zmq.Context()
socket = context.socket(zmq.SUB)


socket.connect("tcp://192.168.178.52:5556")
socket.setsockopt(zmq.SUBSCRIBE,b'')
socket.setsockopt(zmq.CONFLATE, 1)



while True:
    received_bytes = socket.recv()
    np_array = np.frombuffer(received_bytes, dtype=np.uint8)
    image = cv2.imdecode(np_array,1)
    cv2.imshow('image',image)
    cv2.waitKey(1)