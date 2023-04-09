const distanceSensors = require("../../distanceSensors/DistanceSensors");
const { VelocityRobot } = require("../../Robots/Velocity");
const { NAMES } = require("../../distanceSensors/constants");
const { update } = require("./state");

function Avoid(leftMotor, rightMotor) {
  const velocityRobot = new VelocityRobot(leftMotor, rightMotor);

  function handleDistance(distance) {
    const { translation, rotation } = update(distance);
    console.log({ translation, rotation });
    if (translation > 600 || rotation > 5) {
      console.log("too high");
      velocityRobot.update(0, 0);
      stop();
    }
    velocityRobot.update(translation, rotation);
  }

  function start() {
    console.log("starting");
    distanceSensors.on("distances", handleDistance);
    distanceSensors.start(1000);
    velocityRobot.start(0, 0);
  }

  function stop() {
    distanceSensors.removeListener("distances", handleDistance);
    velocityRobot.stop();
  }

  return {
    start,
    stop,
  };
}

module.exports = Avoid;
