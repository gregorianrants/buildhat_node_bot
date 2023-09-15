const zmq = require("zeromq")

async function run() {
  const sock = new zmq.Subscriber

  sock.connect("tcp://192.168.178.47:5559")
  sock.subscribe("")


  for await (const [msg] of sock) {
    console.log( msg)
  }
}

run()
