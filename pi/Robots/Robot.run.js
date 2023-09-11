const { motorFactory } = require("../Motor/Motor");
const { Robot } = require("./Robot");
const { setTimeout } = require("timers/promises");

async function main() {
  try {
    let leftMotor = await motorFactory("C", "left");
    let rightMotor = await motorFactory("D", "right");

    let robot = new Robot(leftMotor, rightMotor);

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

    async function run() {
      //await setTimeout(1000);
      robot.forward(500);
      await setTimeout(2000);
      await robot.stop();
      robot.pivotLeft(1.75 * Math.PI);
      await setTimeout(2000);
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
