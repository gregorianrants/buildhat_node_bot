const distanceSensors = require("../../distanceSensors/DistanceSensors");

// const { VelocityRobot } = require("../../Robots/Velocity");
const Robot = require('../../Robot/Robot')
const { NAMES } = require("../../distanceSensors/constants");
const { update } = require("./state");

class Avoid {
  constructor() {
    // this.velocityRobot = new VelocityRobot(leftMotor, rightMotor);
    this.robot = new Robot();
    this.previousState = null;
  }

  async init(){
    await this.robot.init()
    console.log("starting");
    distanceSensors.on("distances", this.handleDistance);
    distanceSensors.start(100);
  }

  async cleanUp() {
    console.log("stopping");
    distanceSensors.removeListener("distances", this.handleDistance);
    this.robot.cleanUp()
  }

  handleDistance = (distance) => {
    const { translation, rotation, state } = update(distance);

    // console.log("state", state);
    // console.log({ translation, rotation });
    // console.log(distance);

    this.previousState = state;
    if (translation > 700 || rotation > 5) {
      console.log("too high");
      this.robot.update(0, 0);
      this.stop();
    }
    this.robot.update(translation, rotation);
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

  
}

module.exports = Avoid;
