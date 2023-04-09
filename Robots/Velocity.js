const { MotorSpeed } = require("../Motor/MotorSpeed");
const { DISTANCE_BETWEEN_WHEELS } = require("../Constants");

let unused = 0;

function getVelocities(translational, rotational) {
  const v_right = translational + (DISTANCE_BETWEEN_WHEELS / 2) * rotational;
  const v_left = translational - (DISTANCE_BETWEEN_WHEELS / 2) * rotational;

  return { v_left, v_right };
}

class VelocityRobot {
  constructor(leftMotor, rightMotor) {
    this.leftMotor = leftMotor;
    this.rightMotor = rightMotor;
    this.leftMotorSpeed = new MotorSpeed(this.leftMotor);
    this.rightMotorSpeed = new MotorSpeed(this.rightMotor);
  }

  start(translational = 0, rotational = 0) {
    const { v_left, v_right } = getVelocities(translational, rotational);
    this.leftMotorSpeed.start(v_left);
    this.rightMotorSpeed.start(v_right);
  }

  update(translational = 0, rotational=0){
    const { v_left, v_right } = getVelocities(translational, rotational);
    this.leftMotorSpeed.setPoint = v_left
    this.rightMotorSpeed.setPoint = v_right
  }

  stop() {
    this.leftMotorSpeed.stop();
    this.rightMotorSpeed.stop();
  }
}

module.exports = {
  VelocityRobot,
};
