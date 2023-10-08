const MotorSpeed = require("./MotorSpeed");
const { DISTANCE_BETWEEN_WHEELS } = require("../Constants");
const { performance } = require("perf_hooks");
const zmq = require("zeromq");
const { initialize, configureInterfaces } = require("pigpio");
const Motor = require("./Motor");
const { EventEmitter } = require("events");

// class Robot extends EventEmitter {
//   constructor() {
//     super();
//     this.leftMotor = new Motor("C", "left");
//     this.rightMotor = new Motor("D", "right");
//     this.leftMotorSpeed = new MotorSpeed(this.leftMotor);
//     this.rightMotorSpeed = new MotorSpeed(this.rightMotor);
//     this.abortController = new AbortController();
//     this.running = false;
//   }

//   async start(translational = 0, rotational = 0) {
//     const { v_left, v_right } = getVelocities(translational, rotational);
//     this.leftMotorSpeed.start(v_left);
//     this.rightMotorSpeed.start(v_right);
//   }

//   async stop() {
//     this.update(0, 0);
//   }

//   onceStopped(F, name) {
//     console.log(`queing up ${name}`);
//     this.removeAllListeners("stopped");
//     this.stop();
//     this.once("stopped", () => {
//       console.log(`command: ${name}`);
//       F();
//     });
//   }

//   forward(translationalSpeed = 500) {
//     this.onceStopped(() => {
//       this.leftMotorSpeed.setPoint = translationalSpeed;
//       this.rightMotorSpeed.setPoint = translationalSpeed;
//     }, "forward");
//   }

//   backwards(backwardsSpeed = 400) {
//     this.onceStopped(() => {
//       this.leftMotorSpeed.setPoint = -backwardsSpeed;
//       this.rightMotorSpeed.setPoint = -backwardsSpeed;
//     }, "backwards");
//   }

//   async pivotLeft(rotational = 1.5 * Math.PI) {
//     this.onceStopped(() => {
//       const { v_left, v_right } = getVelocities(0, rotational);
//       this.leftMotorSpeed.setPoint = v_left;
//       this.rightMotorSpeed.setPoint = v_right;
//     }, "pivotLeft");
//   }

//   async pivotRight(rotational = 1.5 * Math.PI) {
//     this.onceStopped(() => {
//       const { v_left, v_right } = getVelocities(0, -rotational);
//       this.leftMotorSpeed.setPoint = v_left;
//       this.rightMotorSpeed.setPoint = v_right;
//     }, "pivotRight");
//   }

//   update(translational = 0, rotational = 0) {
//     const { v_left, v_right } = getVelocities(translational, rotational);
//     this.leftMotorSpeed.setPoint = v_left;
//     this.rightMotorSpeed.setPoint = v_right;
//   }

//   setupStopEmitter() {
//     let left = 10;
//     let right = 10;
//     this.leftMotor.on("encoder", ({ speed }) => {
//       left = speed;
//     });
//     this.rightMotor.on("encoder", ({ speed }) => {
//       right = speed;
//       if ((left === 0) & (right === 0)) {
//         this.emit("stopped");
//       }
//     });
//   }

//   async init() {
//     await this.leftMotor.init();
//     await this.rightMotor.init();
//     this.setupStopEmitter();
//     this.start();
//   }

//   async cleanUp() {
//     this.rightMotor.cleanUp();
//     this.leftMotor.cleanUp();
//   }
// }

class Robot extends EventEmitter {
  constructor() {
    super();
    this.leftMotor = new Motor("C", "left");
    this.rightMotor = new Motor("D", "right");
    this.leftMotorSpeed = new MotorSpeed(this.leftMotor);
    this.rightMotorSpeed = new MotorSpeed(this.rightMotor);
    this.abortController = new AbortController();
    this.running = false;
  }

  getVelocities(translational, rotational) {
    const v_right = translational + (DISTANCE_BETWEEN_WHEELS / 2) * rotational;
    const v_left = translational - (DISTANCE_BETWEEN_WHEELS / 2) * rotational;
    return { v_left, v_right };
  }

  async start(translational = 0, rotational = 0) {
    const { v_left, v_right } = this.getVelocities(translational, rotational);
    this.leftMotorSpeed.start(v_left);
    this.rightMotorSpeed.start(v_right);
  }

  async stop() {
    this.update(0, 0);
  }

  async init() {
    await this.leftMotor.init();
    await this.rightMotor.init();
    this.start();
  }

  async cleanUp() {
    this.rightMotor.cleanUp();
    this.leftMotor.cleanUp();
  }
}

module.exports = Robot;
