const { initialize } = require("pigpio");
const PIDController = require("../utilities/PIDController");

class MotorSpeed {
  constructor(motor) {
    this.motor = motor;
    this.p = 0.001;
    this.k = 0;
    this.d = 0.002;
    this.pid = new PIDController(this.p, this.k, this.d);
    //power should probably be passed by previouse behaviour
    this.power = 0;
    this.errors = [];
    this._setPoint = 0;
    this.running = false;
    this.update = this.update.bind(this);
  }

  resetState() {
    this.power = 0;
    this._setPoint = 0;
    this.running = false;
    //consider adding a reset state to pid controller.
    this.pid = new PIDController(this.p, this.k, this.d);
  }

  update(data) {
    let { speed } = data;
    let error = speed - this.setPoint;
    //console.log(`error ${this.motor.portLetter}`, error);
    //this.errors.push(error);
    let adjustment = this.pid.get_value(error);
    this.power = this.setPoint === 0 ? 0 : this.power - adjustment;
    //console.log(speed, error, adjustment, this.power);
    this.motor.pwm = this.power;
  }

  set setPoint(speed) {
    this._setPoint = speed;
  }

  get setPoint() {
    return this._setPoint;
  }

  start(setPoint = 0) {
    console.log("initialising motor speed");
    this.setPoint = setPoint;
    console.log(this.setPoint);
    //this.power = Math.max(this.motor.pwm, this.setPoint / 4);
    this.power = this.motor.pwm;
    this.running = true;
    this.motor.on("encoder", this.update);
  }

  transferControl() {
    this.motor.removeListener("encoder", this.update);
    this.resetState();
  }

  async stop() {
    console.log("in stop");
    this.motor.removeListener("encoder", this.update);
    this.resetState();
    this.motor.pwm = 0;
    this.running = false;
    let p = new Promise((resolve, reject) => {
      this.motor.on("encoder", ({ speed }) => {
        if (speed == 0) {
          resolve();
        }
      });
    });
    return p;
  }
}

module.exports = MotorSpeed;
