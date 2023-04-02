const { SerialPort, ReadlineParser } = require("serialport");
const util = require("util");
const { EventEmitter } = require("events");
const { mainModule } = require("process");

let port = new SerialPort({
  path: "/dev/serial0",
  baudRate: 115200,
});

function ready() {
  let p = new Promise((res, rej) => {
    port.on("open", () => {
      res("open");
    });
  });
  return p;
}

function write(data) {
  let p = new Promise((resolve, reject) => {
    port.write(data, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
  return p;
}

const readLine = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

module.exports = { ready, write, readLine };
