//192.168.178.52:3000
// const { WebSocketServer } = require("ws");
// const { spawn } = require("child_process");
// const { to } = require("mathjs");
// const os = require("os");
// console.log(os.endianness());

// const { ReadlineParser } = require("@serialport/parser-readline");

// const wss = new WebSocketServer({ port: 3000 });

// wss.on("connection", function connection(ws) {
//   const ls = spawn("libcamera-vid", [
//     "-t",
//     "0",
//     "--codec",
//     "mjpeg",
//     "--segment",
//     "1",
//     "-o",
//     "-",
//     "--width",
//     "640",
//     "--height",
//     "480",
//     "--framerate",
//     "20"
//   ]);

//   ls.stderr.on("error", (error) => {
//     console.error("child process error", error);
//   });

//   ls.on("close", (code) => {
//     console.log(`child process exited with code ${code}`);
//   });

//   ls.stdout.on("data", (data) => {
//       ws.send(data)
//   });

//   ws.on("error", console.error);

//   ws.on("message", function message(event) {
//       console.log("received:", event.toString());
//   });

//   ws.on("close", () => {
//     ls.kill("SIGINT");
//     console.log("web socket closed");
//   });
// });

// process.on("uncaughtException", (err) => console.error('there was an error:',err));

const { WebSocketServer } = require("ws");
const { spawn } = require("child_process");
const { to } = require("mathjs");
const os = require("os");
console.log(os.endianness());

const { ReadlineParser } = require("@serialport/parser-readline");

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
  "--framerate",
  "20",
]);

ls.stderr.on("error", (error) => {
  console.error("child process error", error);
});

ls.on("close", (code) => {
  console.log(`child process exited with code ${code}`);
});

// ls.stdout.on("data", (data) => {
//   console.log(data);
// });

let buffer = Buffer.from("ffd9", "hex");
const stop = new Uint16Array(
  buffer.buffer,
  buffer.byteOffset,
  buffer.length / 2
);

console.log(stop);
console.log(stop.indexOf(255, 217));

ls.stdout.on("readable", () => {
  let chunk;
  while ((chunk = ls.stdout.read()) !== null) {
    let chunk16 = new Uint16Array(
      chunk.buffer,
      chunk.byteOffset,
      chunk.length / 2
    );
    //console.log(chunk16);
    //console.log(stop);
    let indexOfStop = chunk16.indexOf(stop[0]);
    if (indexOfStop !== -1) {
      console.log(indexOfStop);
      console.log(chunk16.length);
      console.log("-----------");
    } else {
      console.log("-----");
    }
  }
});

process.on("uncaughtException", (err) =>
  console.error("there was an error:", err)
);
