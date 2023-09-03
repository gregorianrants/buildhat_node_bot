 async function run() {
  const sock = new zmq.Publisher

  await sock.bind("tcp://*:3000")
  console.log("Publisher bound to port 3000")

  while (true) {
    console.log("sending a multipart message envelope")
    //await sock.send(JSON.stringify({left: 10}))
    await sock.send(["left",JSON.stringify({speed: 10, pos: 5})])
    await sock.send(["right",JSON.stringify({speed: 10, pos: 5})])
    await new Promise(resolve => { setTimeout(resolve, 500) })
  }
}

run()