const zmq = require("zeromq")




async function subscribe() {
  const sock = new zmq.Request

  sock.connect("tcp://192.168.178.47:3000")
  console.log("Producer bound to port 3000")

  let action =  {"action": "register", 
  "register_as": "subscriber", 
  "subscribe_to_node": "floor_detector", 
  "subscribe_to_topic": "floor_detector_features"
  }

  let success = false

  let subAddress

  while(!success){
    await sock.send(JSON.stringify(action))
    let result = await sock.receive()
    //console.log(result.toString())
    result = JSON.parse(result.toString())
    if (result.result ==='success'){
     subAddress = result.data.fullAddress
     success = true
    }
  }

  console.log('subscribing to', subAddress)

  return subAddress
}



async function run() {
  let subAddress = await subscribe()
  const sock = new zmq.Subscriber

  sock.connect(subAddress)
  sock.subscribe("")

  count = 0

  for await (const [msg] of sock) {
    //console.log( msg.toString())
    if(count==29){
      console.log(msg.toString())
    }
    count = (count+1)%30
  }
}

run()
