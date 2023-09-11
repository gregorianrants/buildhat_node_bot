const { DistanceSensor } = require("./DistanceSensor");
var circarray2iterator = require("@stdlib/array-to-circular-iterator");
const { EventEmitter } = require("events");
const { CONFIG } = require("./constants");
const { off } = require("process");
const { distance } = require("mathjs");

const distances = CONFIG.map((sensor) => sensor.sensorName).reduce(
  (a, b) => ({ ...a, [b]: null }),
  {}
);

const emmiter = new EventEmitter();

const sensors = CONFIG.map(
  (sensorPinNumbers) => new DistanceSensor(sensorPinNumbers)
);

function allRead(distances) {
  for (const [key, value] of Object.entries(distances)) {
    if (!value) return false;
  }
  return true;
}

const subsequentHandler = (sensor) => (distance) => {
  distances[sensor.name] = distance;
  emmiter.emit("distances", distances);
};

function initialHandler(sensor) {
  return function inner(distance) {
    console.log(
      "initial handler running distances will not be emmitted till all sensors have provided and inital reading"
    );
    distances[sensor.name] = distance;
    if (allRead(distances)) {
      console.log(
        "all sensors have been read will now start emitting distances"
      );
      sensor.removeListener("distance", inner);
      sensor.on("distance", subsequentHandler(sensor));
    }
  };
}

sensors.forEach((sensor, i) => sensor.on("distance", initialHandler(sensor)));

const groupings = [
  [0, 2, 4].map((index) => sensors[index]),
  [1, 3].map((index) => sensors[index]),
];

let it = circarray2iterator(groupings);

function start(interval = 1000) {
  it.next().value.forEach((sensor) => sensor.read());
  setInterval(() => {
    it.next().value.forEach((sensor) => sensor.read());
  }, interval);
}

emmiter.start = start;
emmiter.sensors = sensors;

module.exports = emmiter;
