//192.168.178.52:3000
const { WebSocketServer } = require("ws");
const { spawn } = require("child_process");
const { to } = require("mathjs");
const os = require("os");
console.log(os.endianness());

const { ReadlineParser } = require("@serialport/parser-readline");

const wss = new WebSocketServer({ port: 3000 });

wss.on("connection", function connection(ws) {
  const ls = spawn("libcamera-vid", [
    "-t",
    "0",
    "--codec",
    "mjpeg",
    "--segment",
    "1",
    "-o",
    "-",
    "--width",
    "640",
    "--height",
    "480",
  ]);

  ls.stderr.on("error", (error) => {
    console.error("child process error", error);
  });

  ls.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });

  ls.stdout.on("data", (data) => {
    ws.send(data);
  });

  ws.on("error", console.error);

  ws.on("message", function message(event) {
    console.log("received: %s", event);
  });

  ws.on("close", () => {
    ls.kill("SIGINT");
    console.log("web socket closed");
  });
});

process.on("uncaughtException", (err) => console.error(err));
