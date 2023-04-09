const PIDController = require("../utilities/PIDController");

// class PIController {
//   constructor(
//     proportional_constant = 0,
//     integral_constant = 0,
//     derivative_constant = 0
//   ) {
//     this.proportional_constant = proportional_constant;
//     this.integral_constant = integral_constant;
//     this.derivative_constant = derivative_constant;
//     // Running sums
//     this.integral_sum = 0;
//     this.previous = 0;
//   }

//   handle_proportional(error) {
//     return this.proportional_constant * error;
//   }

//   handle_integral(error) {
//     this.integral_sum += error;
//     return this.integral_constant * error;
//   }

//   handle_derivative(error) {
//     const derivative = this.derivative_constant * (error - this.previous);
//     this.previous = error;
//     return derivative;
//   }

//   get_value(error) {
//     let p = this.handle_proportional(error);
//     let i = this.handle_integral(error);
//     let d = this.handle_derivative(error);
//     return p + i + d;
//   }
// }

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

  start(setPoint) {
    this.setPoint = setPoint;
    console.log(this.setPoint);
    //this.power = Math.max(this.motor.pwm, this.setPoint / 4);
    this.power = 0;
    this.running = true;
    this.motor.pwm = this.power;
    this.motor.on("encoder", this.update);
  }

  stop() {
    console.log("in stop");
    this.motor.removeListener("encoder", this.update);
    this.running = false;
  }
}

module.exports = { MotorSpeed };
