const { motorFactory } = require("../Robot/Motor");
const Robot = require("../Robot/Robot");
const { setTimeout } = require("timers/promises");

var keypress = require("keypress");

// make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);

async function main() {
  try {
    let leftMotor = await motorFactory("C", "left");
    let rightMotor = await motorFactory("D", "right");

    let robot = new Robot(leftMotor, rightMotor);
    await robot.start()

    function cleanUpAndExit() {
      process.nextTick(() => {
        robot.stop();

        process.nextTick(() => {
          leftMotor.cleanUp();
          rightMotor.cleanUp();
          setTimeout(100).then(() => process.exit(0));
        });
      });
    }

    await setTimeout(1000)

    process.stdin.on("keypress", async (ch, key) => {
      console.log('got "keypress"', key);

      if (key && key.name == "up") {
        robot.forward();
      }
      if (key && key.name == "down") {
        robot.backwards();
      }
      if (key && key.name == "left") {
        robot.pivotLeft();
      }
      if (key && key.name == "right") {
        robot.pivotRight();
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
    console.log(error);
    leftMotor.cleanUp();
    //rightMotor.cleanUp();
  }
}

main();
