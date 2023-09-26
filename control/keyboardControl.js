const { motorFactory } = require("../Robot/Motor");
const { setTimeout } = require("timers/promises");
const Avoid = require("../atomicBehaviours/avoid/Avoid");

var keypress = require("keypress");

// make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);

const commands = {
  space: "start",
  return: "stop",
};

async function keyboardControl({ Behaviour, forSeconds = 5 }) {
  let leftMotor = await motorFactory("C", "left");
  let rightMotor = await motorFactory("D", "right");

  let behaviour = new Behaviour(leftMotor, rightMotor);

  function cleanUpAndExit() {
    process.nextTick(() => {
      behaviour.stop();
      process.nextTick(() => {
        leftMotor.cleanUp();
        rightMotor.cleanUp();
        setTimeout(100).then(() => process.exit(0));
      });
    });
  }

  try {
    let running = false;
    console.log("setting up");

    process.stdin.on("keypress", async (ch, key) => {
      console.log('got "keypress"', key);
      if (key && key.name == "return" && !running) {
        console.log(key.name);
        running = true;
        behaviour.command("start");
      }
      if (key && key.name == "space") {
        behaviour.command("stop");
        running = false;
      }
      if (key && key.ctrl && key.name == "c") {
        cleanUpAndExit();
      }
    });

    process.stdin.setRawMode(true);
    process.stdin.resume();

    process
      .on("SIGINT", () => {
        cleanUpAndExit();
      })
      .on("uncaughtException", (err) => {
        console.error(err, "Uncaught Exception thrown");
        cleanUpAndExit();
        process.exit(1);
      });
  } catch (error) {
    console.error(error);
    cleanUpAndExit();
  }
}

keyboardControl({ Behaviour: Avoid });
