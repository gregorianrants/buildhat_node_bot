const express = require("express");
var app = express();
const cors = require("cors");
app.use(cors());
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

function setUpCamera(socket) {
  // redis_s.on('message',(channel,message)=>{
  //   if(channel=='camera'){
  //     socket.emit('data', "data:image/jpeg;base64," + message.toString("base64"));
  //   }
  // })
}

function handleDisconnect(socket) {
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
}

async function onConnection(socket) {
  console.log("a user connected");
  setUpCamera(socket);
  handleDisconnect(socket);

  socket.on("record", (msg) => {
    if (msg === "start") {
      console.log("start");
    }
    if (msg === "stop") {
      console.log("record");
    }
  });
}

function setUpSocket() {
  io.on("connection", onConnection);
}

setUpSocket();

//TODO we are currently serving react from local host 3000 on windows?
server.listen(3000, "0.0.0.0", () => {
  console.log("listening on *:3000");
});
