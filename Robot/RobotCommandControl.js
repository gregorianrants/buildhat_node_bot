const Robot = require("./Robot.js");

class RobotCommandControl extends Robot {
  constructor() {
    super();
  }

  onceStopped(F, name) {
    console.log(`queing up ${name}`);
    this.removeAllListeners("stopped");
    this.stop();
    this.once("stopped", () => {
      console.log(`command: ${name}`);
      F();
    });
  }

  forward(translationalSpeed = 500) {
    this.onceStopped(() => {
      this.leftMotorSpeed.setPoint = translationalSpeed;
      this.rightMotorSpeed.setPoint = translationalSpeed;
    }, "forward");
  }

  backwards(backwardsSpeed = 400) {
    this.onceStopped(() => {
      this.leftMotorSpeed.setPoint = -backwardsSpeed;
      this.rightMotorSpeed.setPoint = -backwardsSpeed;
    }, "backwards");
  }

  async pivotLeft(rotational = 1.5 * Math.PI) {
    this.onceStopped(() => {
      const { v_left, v_right } = this.getVelocities(0, rotational);
      this.leftMotorSpeed.setPoint = v_left;
      this.rightMotorSpeed.setPoint = v_right;
    }, "pivotLeft");
  }

  async pivotRight(rotational = 1.5 * Math.PI) {
    this.onceStopped(() => {
      const { v_left, v_right } = this.getVelocities(0, -rotational);
      this.leftMotorSpeed.setPoint = v_left;
      this.rightMotorSpeed.setPoint = v_right;
    }, "pivotRight");
  }

  update(translational = 0, rotational = 0) {
    const { v_left, v_right } = this.getVelocities(translational, rotational);
    this.leftMotorSpeed.setPoint = v_left;
    this.rightMotorSpeed.setPoint = v_right;
  }

  setupStopEmitter() {
    let left = 10;
    let right = 10;
    this.leftMotor.on("encoder", ({ speed }) => {
      left = speed;
    });
    this.rightMotor.on("encoder", ({ speed }) => {
      right = speed;
      if ((left === 0) & (right === 0)) {
        this.emit("stopped");
      }
    });
  }

  async init() {
    await super.init();
    this.setupStopEmitter();
  }
}

module.exports = RobotCommandControl;
