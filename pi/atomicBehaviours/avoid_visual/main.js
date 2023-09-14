// zmq = require('zeromq')

// async function init(){
//     socket = new zmq.Subscriber()
//     socket.connect('tcp://172.31.21.98:5559')
//     socket.subscribe('h')

//     for await(const [msg] of socket){
//         console.log(msg)
//     }
// }



// init()

const zmq = require("zeromq")

async function run() {
  const sock = new zmq.Subscriber

  sock.connect("tcp://192.168.178.47:5559")
  sock.subscribe("kitty cats")
  console.log("Subscriber connected to port 3000")

  for await (const [topic, msg] of sock) {
    console.log("received a message related to:", topic, "containing message:", msg)
  }
}

run()
