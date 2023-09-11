const { motorFactory } = require("./Motor");
const { MotorSpeed } = require("./MotorSpeed");
const { setTimeout } = require("timers/promises");

function next(f) {
  () => {
    process.nextTick(f);
  };
}

async function main() {
  console.log("asdfsadfsdfsdf");

  try {
    let leftMotor = await motorFactory("C", "left");
    let rightMotor = await motorFactory("D", "right");

    let leftMotorSpeed = new MotorSpeed(leftMotor);
    let rightMotorSpeed = new MotorSpeed(rightMotor);

    function cleanUpAndExit() {
      process.nextTick(() => {
        leftMotorSpeed.stop();
        rightMotorSpeed.stop();
        process.nextTick(() => {
          leftMotor.cleanUp();
          rightMotor.cleanUp();
          setTimeout(500).then(() => process.exit(0));
        });
      });
    }

    async function run() {
      leftMotorSpeed.start(500);
      rightMotorSpeed.start(500);
      await setTimeout(3000);
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
      });
  } catch (error) {
    console.log(error);
    cleanUpAndExit();
  }
}

main();
