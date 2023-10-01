const Robot = require("../../Robot/Robot");
const Subscriber = require("./Subscriber");
const { MODES, ACTIONS, SIDES, TRANSITIONS } = require("./constants");
const store = require("./store");

class SelfDrive {
  constructor(motors) {
    this.motorsState = MODES.STOPPED;
    this.state = null;
    this.previousAction = null;
    this.nextAction = ACTIONS.STOP;
    this.running = false;
    this.robot = new Robot();
    this.store = store();
    this.distance_listner = new Subscriber(
      "floor_detector_features",
      "floor_detector"
    );
    //console.log(this.motors)
    this.eventHandler = null;
  }

  resetState() {
    this.store = store();
    this.previousAction = null;
    this.nextAction = ACTIONS.STOP;
  }

  handleNewData(left, right) {
    //console.log('left: ',left,'right: ',right)
    this.store.updateState(left, right);
    this.nextAction = this.store.getState().action;
    //console.log(this.store.getState())
    if (this.nextAction !== this.previousAction) {
      this.handleAction();
      this.previousAction = this.nextAction;
    }
  }

  async handleAction() {
    console.log("action has changed");
    console.log(this.nextAction);
    if (this.nextAction == ACTIONS.STOP) {
      await this.robot.stop();
      this.robot.backwards(200);
    }
    if (this.nextAction == ACTIONS.FORWARD) {
      await this.robot.stop();
      this.robot.forward(300);
      //console.log('forward')
    }
    if (this.nextAction == ACTIONS.PIVOT_LEFT) {
      await this.robot.stop();
      this.robot.pivotLeft(Math.PI * 0.75);
      //console.log('left')
    }
    if (this.nextAction == ACTIONS.PIVOT_RIGHT) {
      await this.robot.stop();
      this.robot.pivotRight(Math.PI * 0.75);
      //console.log('right')
    }
    //     if(this.nextAction ==ACTIONS.STOP){
    //             this.robot.stop()
    //             console.log('right')
    //     }
  }

  async init() {
    await this.robot.init();
    await this.distance_listner.init();
    //we are adding this as an attribute so we can removeListner later, bit scrappy maybe revise
    this.eventHandler = (message) => {
      const { left_closest, right_closest } = JSON.parse(message);
      this.handleNewData(left_closest, right_closest);
    };
    this.distance_listner.on("message", this.eventHandler);
  }

  async cleanUp() {
    this.distance_listner.removeListener("message", this.eventHandler);
    this.resetState();
    this.handleAction();
    console.log("unsubscribed");
    await this.robot.cleanUp();
  }
}

module.exports = SelfDrive;
