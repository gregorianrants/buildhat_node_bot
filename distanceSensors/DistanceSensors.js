const { DistanceSensor } = require("./DistanceSensor");
var circarray2iterator = require("@stdlib/array-to-circular-iterator");
const { EventEmitter } = require("events");

const distances = {};

const emmiter = new EventEmitter();

const pinNumbers = [
  { triggerPin: 27, echoPin: 22, sensorName: "left" },
  { triggerPin: 23, echoPin: 24, sensorName: "front_left" },
  { triggerPin: 6, echoPin: 16, sensorName: "middle" },
  { triggerPin: 21, echoPin: 20, sensorName: "front_right" },
  { triggerPin: 26, echoPin: 19, sensorName: "right" },
];

const sensors = pinNumbers.map(
  (sensorPinNumbers) => new DistanceSensor(sensorPinNumbers)
);

sensors.forEach((sensor, i) =>
  sensor.on("distance", (distance) => {
    distances[sensor.name] = distance;
    emmiter.emit("distances", distances);
  })
);

const defaultGrouping = [
  [0, 2, 4],
  [1, 3],
];

function DistanceSensors(groupings = defaultGrouping) {
  function on(eventName, handler) {
    emmiter.on(eventName, handler);
  }

  groupings = groupings.map((group) =>
    group.map((sensorIndex) => sensors[sensorIndex])
  );

  let it = circarray2iterator(groupings);

  function start() {
    it.next().value.forEach((sensor) => sensor.read());
    setInterval(() => {
      it.next().value.forEach((sensor) => sensor.read());
    }, 1500);
  }

  return {
    start,
    on,
    sensors,
  };
}

module.exports = DistanceSensors;
