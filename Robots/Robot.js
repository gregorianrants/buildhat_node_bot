const { MotorSpeed } = require("../Motor/MotorSpeed");
const { DISTANCE_BETWEEN_WHEELS } = require("../Constants");
const { performance } = require('perf_hooks');
const zmq = require("zeromq")

function getVelocities(translational, rotational) {
  const v_right = translational + (DISTANCE_BETWEEN_WHEELS / 2) * rotational;
  const v_left = translational - (DISTANCE_BETWEEN_WHEELS / 2) * rotational;
  return { v_left, v_right };
}

class Odometry {

  constructor(leftMotor,rightMotor){
    this.theta = 0
    this.x = 0
    this.y = 0
    this.Vl = null
    this.Vr = null
    this.previousTime = null
    this.leftMotor = leftMotor
    this.rightMotor = rightMotor
    this.updateLeft = this.updateLeft.bind(this)
    this.updateRight = this.updateRight.bind(this)
    this.start()
    // this.rightMotor.on('encoder',([speed,pos,apos])=>{
    //   this.Vr = speed
    //   console.log('Vr set to ', this.Vr)
    // })
  }

  updateLeft({portIndex,speed,pos,apos}){
    this.Vl = speed
    
    let currentTime = performance.now()/1000
    if(this.Vr && this.previousTime){
      let dt = currentTime-this.previousTime
      this.x = this.x + this.Vl*dt*Math.cos(this.theta)
      this.y = this.y + this.Vr*dt*Math.sin(this.theta)
      let Vtheta = (this.Vr-this.Vl)/DISTANCE_BETWEEN_WHEELS
      this.theta = this.theta + Vtheta*dt
      console.log('theta',this.theta)
    }
    this.previousTime = currentTime
  }

  updateRight({portIndex,speed,pos,apos}){
    this.Vr = speed
  }

  start(){
    this.leftMotor.on('encoder',this.updateLeft)
    this.rightMotor.on('encoder',this.updateRight)
  }
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
