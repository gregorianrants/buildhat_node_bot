const { distance } = require("mathjs");
const distanceSensors = require("../../distanceSensors/DistanceSensors");
const { VelocityRobot } = require("../../Robots/Velocity");
const PIDController = require("../../utilities/PIDController");
var clamp = require("lodash.clamp");

const rightSensor = distanceSensors.sensors.find(
  (sensor) => sensor.name === "right"
);

function WallTrack(leftMotor, rightMotor) {
  const velocityRobot = new VelocityRobot(leftMotor, rightMotor);
  const pid = new PIDController(0.06, 0, 0);
  let setPoint = 30;

  function handleDistance(distance) {
    console.log(distance);
    let error = clamp(distance - setPoint, -10, 10);
    console.log("error", error);
    let adjustment = pid.get_value(error);
    console.log("adjustment", adjustment);
    velocityRobot.update(300, -adjustment);
  }

  function start() {
    distanceSensors.start(50);
    velocityRobot.start(0, 0);
    rightSensor.on("distance", handleDistance);
  }

  function stop() {
    velocityRobot.stop();
  }

  return {
    start,
    stop,
  };
}

module.exports = WallTrack;
