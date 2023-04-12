const distanceSensors = require("../../distanceSensors/DistanceSensors");
const { VelocityRobot } = require("../../Robots/Velocity");
const { NAMES } = require("../../distanceSensors/constants");
const { update } = require("./state");
const { columnTransformDependencies } = require("mathjs");

function Avoid(leftMotor, rightMotor) {
  const velocityRobot = new VelocityRobot(leftMotor, rightMotor);
  let previousState = null;

  function handleDistance(distance) {
    const { translation, rotation, state } = update(distance);

    // console.log("state", state);
    // console.log({ translation, rotation });
    // console.log(distance);

    previousState = state;
    if (translation > 700 || rotation > 5) {
      console.log("too high");
      velocityRobot.update(0, 0);
      stop();
    }
    velocityRobot.update(translation, rotation);
  }

  function command(command) {
    if (command === "start") {
      return start();
    }
    if (command === "stop") {
      return stop();
    }
    throw Error("command not recognised");
  }

  function start() {
    console.log("starting");
    distanceSensors.on("distances", handleDistance);
    distanceSensors.start(100);
    velocityRobot.start(0, 0);
  }

  function stop() {
    console.log("stopping");
    distanceSensors.removeListener("distances", handleDistance);
    velocityRobot.stop();
  }

  return {
    start,
    stop,
    command,
  };
}

module.exports = Avoid;
