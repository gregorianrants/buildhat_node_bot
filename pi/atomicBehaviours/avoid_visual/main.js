const zmq = require("zeromq")




async function run() {
  const sock = new zmq.Request

  sock.connect("tcp://192.168.178.47:3000")
  console.log("Producer bound to port 3000")

  let action =  {action: 'create', entity: 'publisher' ,topic: 'floor-detector', address: }

  await sock.send(JSON.stringify(action))
  const [result] = await sock.receive()

  console.log(result.toString())
}

run()

// async function run() {
//   const sock = new zmq.Subscriber

//   sock.connect("tcp://192.168.178.47:5559")
//   sock.subscribe("")


//   for await (const [msg] of sock) {
//     console.log( msg)
//   }
// }

// run()
