import zmq


def register(context):
    socket = context.socket(zmq.REQ)
    socket.connect("tcp://192.168.178.47:3000")
    socket.send_json(
        {
            "action": "register",
            "register_as": "publisher",
            "topic": "camera",
            "address": "tcp://192.168.178.52",
        }
    )

    message = socket.recv_json()
    return message["data"]["fullAddress"]
