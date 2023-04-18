const distanceSensors = require("../../distanceSensors/DistanceSensors");
const { VelocityRobot } = require("../../Robots/Velocity");
const { NAMES } = require("../../distanceSensors/constants");
const { update } = require("./state");

class Avoid {
  constructor(leftMotor, rightMotor) {
    this.velocityRobot = new VelocityRobot(leftMotor, rightMotor);
    this.previousState = null;
  }

  handleDistance = (distance) => {
    const { translation, rotation, state } = update(distance);

    // console.log("state", state);
    // console.log({ translation, rotation });
    // console.log(distance);

    this.previousState = state;
    if (translation > 700 || rotation > 5) {
      console.log("too high");
      this.velocityRobot.update(0, 0);
      this.stop();
    }
    this.velocityRobot.update(translation, rotation);
  };

  command(command) {
    if (command === "start") {
      return this.start();
    }
    if (command === "stop") {
      return this.stop();
    }
    throw Error("command not recognised");
  }

  start() {
    console.log("starting");
    distanceSensors.on("distances", this.handleDistance);
    distanceSensors.start(100);
    this.velocityRobot.start(0, 0);
  }

  stop() {
    console.log("stopping");
    distanceSensors.removeListener("distances", this.handleDistance);
    this.velocityRobot.stop();
  }
}

module.exports = Avoid;
