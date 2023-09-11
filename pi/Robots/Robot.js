const { MotorSpeed } = require("../Motor/MotorSpeed");
const { DISTANCE_BETWEEN_WHEELS } = require("../Constants");
const { performance } = require('perf_hooks');
const zmq = require("zeromq")

function getVelocities(translational, rotational) {
  const v_right = translational + (DISTANCE_BETWEEN_WHEELS / 2) * rotational;
  const v_left = translational - (DISTANCE_BETWEEN_WHEELS / 2) * rotational;
  return { v_left, v_right };
}


async function initialiseSocket() {
  const sock = new zmq.Publisher

  await sock.bind("tcp://*:3000")
  console.log("Publisher bound to port 3000")

  const update = async ({side,portIndex,speed,pos,apos})=>{
    await sock.send(JSON.stringify({side,portIndex,speed,pos,apos}))
  }
  return update
}

class Robot {
  constructor(leftMotor, rightMotor) {
    this.leftMotor = leftMotor;
    this.rightMotor = rightMotor;
    this.leftMotorSpeed = new MotorSpeed(this.leftMotor);
    this.rightMotorSpeed = new MotorSpeed(this.rightMotor);
    //this.start();
    //this.odometry = new Odometry(this.leftMotor,this.rightMotor)
    this.socket = null
  }

  async start(translational = 0, rotational = 0) {
    this.socket = await initialiseSocket()
    this.leftMotor.on('encoder',({portIndex,speed,pos,apos})=>{
      const side = 'left'
      this.socket({side,portIndex,speed,pos,apos})
    })
    this.rightMotor.on('encoder',({portIndex,speed,pos,apos})=>{
      const side = 'right'
      this.socket({side,portIndex,speed,pos,apos})
    })
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

  update(translational = 0, rotational=0){
    const { v_left, v_right } = getVelocities(translational, rotational);
    this.leftMotorSpeed.setPoint = v_left
    this.rightMotorSpeed.setPoint = v_right
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



module.exports = Robot;