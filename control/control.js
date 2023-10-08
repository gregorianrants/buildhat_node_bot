const { motorFactory } = require("../Robot/Motor");
const Robot = require("../Robot/RobotCommandControl");
const { setTimeout } = require("timers/promises");

var keypress = require("keypress");

// make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);

async function main() {
  let robot = new Robot();
  await robot.init();

  function cleanUpAndExit() {
    process.nextTick(() => {
      robot.cleanUp();
      process.nextTick(() => {
        setTimeout(100).then(() => process.exit(0));
      });
    });
  }

  process
    .on("SIGINT", () => {
      cleanUpAndExit();
    })
    .on("uncaughtException", (err) => {
      console.error(err, "Uncaught Exception thrown");
      cleanUpAndExit();
      process.exit(1);
    });

  await setTimeout(1000);

  process.stdin.on("keypress", async (ch, key) => {
    console.log('got "keypress"', key);

    if (key && key.name == "up") {
      robot.forward(300);
    }
    if (key && key.name == "down") {
      robot.backwards(200);
    }
    if (key && key.name == "left") {
      robot.pivotLeft(0.75 * Math.PI);
    }
    if (key && key.name == "right") {
      robot.pivotRight(0.75 * Math.PI);
    }
    if (key && key.name == "space") {
      robot.stop();
    }
    if (key && key.ctrl && key.name == "c") {
      cleanUpAndExit();
    }
  });

  process.stdin.setRawMode(true);
  process.stdin.resume();
}

main();
