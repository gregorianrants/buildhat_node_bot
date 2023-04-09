const { motorFactory } = require("../../Motor/Motor");
const Avoid = require("./avoid");
const { setTimeout } = require("timers/promises");

console.log(`the velocities i have provided here make the robot trace out a circle with diameter 1m
the translational velocity is set to cover the circumfrence of the circle in 78 seconds
and the rotational velocity is set to make a full rotation in 78 seconds
this results in a circle.
use ctrl + c to stop the robot.
`);

async function main() {
  try {
    let leftMotor = await motorFactory("C", "left");
    let rightMotor = await motorFactory("D", "right");

    let avoid = Avoid(leftMotor, rightMotor);

    function cleanUpAndExit() {
      process.nextTick(() => {
        avoid.stop();

        process.nextTick(() => {
          leftMotor.cleanUp();
          rightMotor.cleanUp();
          setTimeout(100).then(() => process.exit(0));
        });
      });
    }

    async function run() {
      avoid.start();
      await setTimeout(50000);
      cleanUpAndExit();
    }

    run();

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
    rightMotor.cleanUp();
  }
}

main();
