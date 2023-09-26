const { initialize } = require("pigpio");
const PIDController = require("../utilities/PIDController");
const Motor = require('./Motor')

class MotorSpeed {
  constructor(port,side) {
    this.side = side
    this.motor = new Motor(port,side);
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

  async init(setPoint=0){
    console.log('initialising motor speed ', this.side)
    await this.motor.init()
    this.setPoint = setPoint;
    console.log(this.setPoint);
    //this.power = Math.max(this.motor.pwm, this.setPoint / 4);
    this.power = 0;
    this.running = true;
    this.motor.pwm = this.power;
    this.motor.on("encoder", this.update);
  }

  cleanUp(){
    console.log("in stop");
    this.motor.removeListener("encoder", this.update);
    this.power = 0;
    this.motor.pwm = this.power;
    this.running = false;
    this.motor.cleanUp()
  }
}

module.exports = MotorSpeed;
