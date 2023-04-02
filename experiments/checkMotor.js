const { motorFactory } = require("../Motor/Motor");
const { setTimeout } = require("timers/promises");

console.log(`this was an eperiment i ran to check what units the speed as outputed by build hat were in
it relied on the build hat outputting raw values not altered for wheel dimensions
motor as it is is probably now outputting speed and pos as distances that take into account wheel size
when running this i discovred that the raw speed value is 
10deggress/second
could also call this
36ths of a rotation per second

`)

function CheckMotor(motor) {
  let speeds = [];
  let startTime = null;
  let endTime = null;
  let startPos = null;
  let endPos = null;

  function initialHandler({ speed, pos }) {
    console.log("initial");
    startTime = Date.now() / 1000;
    startPos = pos;
    speeds.push(speed);
    motor.on("encoder", mainHandler);
  }

  function mainHandler({ speed, pos }) {
    speeds.push(speed);
  }

  function lastHandler({ speed, pos }) {
    console.log("last handler");
    speeds.push(speed);
    endPos = pos;
    endTime = Date.now() / 1000;
    console.log({
      averageSpeed: getAverageSpeed(speeds),
      calculatedSpeed: getCalculatedSpeed(),
    });
  }

  function start() {
    motor.once("encoder", initialHandler);
  }

  function getCalculatedSpeed() {
    console.log("time", endTime - startTime);
    return (endPos - startPos) / (endTime - startTime);
  }

  function getAverageSpeed(speeds) {
    return speeds.reduce((a, b) => a + b, 0) / speeds.length;
  }

  function stop() {
    motor.removeListener("encoder", mainHandler);
    console.log("removing main");
    motor.once("encoder", lastHandler);
    console.log("after last");
  }

  return {
    start,
    stop,
  };
}

module.exports = { CheckMotor };
