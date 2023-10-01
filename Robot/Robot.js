const MotorSpeed = require("./MotorSpeed");
const { DISTANCE_BETWEEN_WHEELS } = require("../Constants");
const { performance } = require("perf_hooks");
const zmq = require("zeromq");
const { initialize, configureInterfaces } = require("pigpio");
const Motor = require("./Motor");

function getVelocities(translational, rotational) {
  const v_right = translational + (DISTANCE_BETWEEN_WHEELS / 2) * rotational;
  const v_left = translational - (DISTANCE_BETWEEN_WHEELS / 2) * rotational;
  return { v_left, v_right };
}

class DummyController {
  constructor() {}

  transferControl() {
    return 0;
  }

  async stop() {
    return true;
  }
}

class Robot {
  constructor() {
    this.leftMotor = new Motor("C", "left");
    this.rightMotor = new Motor("D", "right");
    this.leftMotorSpeed = new MotorSpeed(this.leftMotor);
    this.rightMotorSpeed = new MotorSpeed(this.rightMotor);
    this.leftController = new DummyController();
    this.rightController = new DummyController();
    this.running = false;
  }

  async start(translational = 0, rotational = 0) {
    const { v_left, v_right } = getVelocities(translational, rotational);
    this.leftMotorSpeed.start(v_left);
    this.rightMotorSpeed.start(v_right);
  }

  setMode(mode = "speed") {
    if (mode === "speed") {
      this.leftController.transferControl();
      this.rightController.transferControl();
      this.leftController = this.leftMotorSpeed;
      this.rightController = this.rightMotorSpeed;
    }
  }

  forward(translationalSpeed = 500) {
    this.setMode("speed");
    this.leftController.start(translationalSpeed);
    this.rightController.start(translationalSpeed);
  }

  backwards(backwardsSpeed = 400) {
    this.setMode("speed");
    this.leftController.start(-backwardsSpeed);
    this.rightController.start(-backwardsSpeed);
  }

  pivotLeft(rotational = 1.5 * Math.PI) {
    this.setMode("speed");
    const { v_left, v_right } = getVelocities(0, rotational);
    this.leftController.start(v_left);
    this.rightController.start(v_right);
  }

  pivotRight(rotational = 1.5 * Math.PI) {
    this.setMode("speed");
    const { v_left, v_right } = getVelocities(0, -rotational);
    this.leftController.start(v_left);
    this.rightController.start(v_right);
  }

  update(translational = 0, rotational = 0) {
    const { v_left, v_right } = getVelocities(translational, rotational);
    this.leftMotorSpeed.setPoint = v_left;
    this.rightMotorSpeed.setPoint = v_right;
  }

  async stop() {
    let result = Promise.all([
      this.leftController.stop(),
      this.rightController.stop(),
    ]);
    this.leftController = new DummyController();
    this.rightController = new DummyController();

    return result;
  }

  async init() {
    await this.leftMotor.init();
    await this.rightMotor.init();
  }

  async cleanUp() {
    this.rightMotor.cleanUp();
    this.leftMotor.cleanUp();
  }
}

module.exports = Robot;
