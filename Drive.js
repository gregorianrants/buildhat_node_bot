const { Robot } = require("./Robots/Robot");

class ControlBehaviour {
  constructor(leftMotor, rightMotor, commandEmitter) {
    this.leftMotor = leftMotor;
    this.rightMotor = rightMotor;
    this.commandEmitter = commandEmitter;
    this.robot = new Robot(leftMotor, rightMotor);
  }

  start() {
    this.commandEmitter.on("command", (command) => {
      if (command == "forward") {
        this.robot.forward();
      }
    });
  }
}
