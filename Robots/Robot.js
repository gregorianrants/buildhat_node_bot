const { MotorSpeed } = require("../Motor/MotorSpeed");
const { DISTANCE_BETWEEN_WHEELS } = require("../Constants");

function getVelocities(translational, rotational) {
  const v_right = translational + (DISTANCE_BETWEEN_WHEELS / 2) * rotational;
  const v_left = translational - (DISTANCE_BETWEEN_WHEELS / 2) * rotational;

  return { v_left, v_right };
}

class Robot {
  constructor(leftMotor, rightMotor) {
    this.leftMotor = leftMotor;
    this.rightMotor = rightMotor;
    this.leftMotorSpeed = new MotorSpeed(this.leftMotor);
    this.rightMotorSpeed = new MotorSpeed(this.rightMotor);
    this.start();
  }

  start(translational = 0, rotational = 0) {
    const { v_left, v_right } = getVelocities(translational, rotational);
    this.leftMotorSpeed.start(v_left);
    this.rightMotorSpeed.start(v_right);
  }

  forward(translationalSpeed = 500) {
    this.leftMotorSpeed.setPoint = translationalSpeed;
    this.rightMotorSpeed.setPoint = translationalSpeed;
  }

  backwards(backwardsSpeed = 400) {
    this.leftMotorSpeed.setPoint = -backwardsSpeed;
    this.rightMotorSpeed.setPoint = -backwardsSpeed;
  }

  pivotLeft(rotational = 1.5 * Math.PI) {
    const { v_left, v_right } = getVelocities(0, rotational);
    this.leftMotorSpeed.setPoint = v_left;
    this.rightMotorSpeed.setPoint = v_right;
  }

  pivotRight(rotational = 1.5 * Math.PI) {
    const { v_left, v_right } = getVelocities(0, -rotational);
    this.leftMotorSpeed.setPoint = v_left;
    this.rightMotorSpeed.setPoint = v_right;
  }

  stop() {
    this.leftMotorSpeed.setPoint = 0;
    this.rightMotorSpeed.setPoint = 0;
    const p = new Promise((resolve, reject) => {
      let stoppedMotorCount = 0;

      this.leftMotor.once("encoder", ({ speed }) => {
        if (stoppedMotorCount == 1) {
          return resolve();
        }

        stoppedMotorCount += 1;
      });

      this.rightMotor.once("encoder", ({ speed }) => {
        if (stoppedMotorCount == 1) {
          return resolve();
        }
        stoppedMotorCount += 1;
      });
    });
    return p;
  }
}

module.exports = {
  Robot,
};
