const NAMES = {
  LEFT: "LEFT",
  FRONT_LEFT: "FRONT_LEFT",
  MIDDLE: "MIDDLE",
  FRONT_RIGHT: "FRONT_RIGHT",
  RIGHT: "RIGHT",
};

const CONFIG = [
  { triggerPin: 27, echoPin: 22, sensorName: NAMES.LEFT },
  { triggerPin: 23, echoPin: 24, sensorName: NAMES.FRONT_LEFT },
  { triggerPin: 6, echoPin: 12, sensorName: NAMES.MIDDLE },
  { triggerPin: 21, echoPin: 20, sensorName: NAMES.FRONT_RIGHT },
  { triggerPin: 26, echoPin: 19, sensorName: NAMES.RIGHT },
];

module.exports = {
  NAMES,
  CONFIG,
};
