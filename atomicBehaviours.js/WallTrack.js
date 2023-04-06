const { distance } = require("mathjs");
const DistanceSensors = require("../distanceSensors/DistanceSensors");
const { MotorSpeed } = require("../Motor/MotorSpeed");
const { PIDController } = require("../utilities/PIDController");

const distanceSensors = DistanceSensors();
const rightSensor = distanceSensors.sensors.find(
  (sensor) => sensor.name === "right"
);

function WallTrack(leftMotor, rightMotor) {
  const leftMotorSpeed = new MotorSpeed(leftMotor);
  const rightMotorSpeed = new MotorSpeed(rightMotor);
  const pid = new PIDController(0.5, 0, 0);

  function handleDistance(distance) {
    console.log(distance);
  }

  function start() {
    rightSensor.on("distance", handleDistance);
  }

  function stop() {
    leftMotorSpeed.stop();
    rightMotorSpeed.stop();
  }

  return {
    start,
    stop,
  };
}

module.exports = WallTrack;
