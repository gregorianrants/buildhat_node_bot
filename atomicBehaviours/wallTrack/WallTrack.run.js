const { motorFactory } = require("../../Robot/Motor");
const WallTrack = require("./WallTrack");

const { setTimeout } = require("timers/promises");

async function main() {
  console.log("asdfsadfsdfsdf");
  let leftMotor, rightMotor, wallTrack;

  function cleanUpAndExit() {
    process.nextTick(() => {
      // leftMotorSpeed.stop();
      // rightMotorSpeed.stop();
      wallTrack.stop();
      process.nextTick(() => {
        leftMotor.cleanUp();
        rightMotor.cleanUp();
        setTimeout(500).then(() => process.exit(0));
      });
    });
  }

  try {
    leftMotor = await motorFactory("C", "left");
    rightMotor = await motorFactory("D", "right");

    // let leftMotorSpeed = new MotorSpeed(leftMotor);
    // let rightMotorSpeed = new MotorSpeed(rightMotor);
    wallTrack = WallTrack(leftMotor, rightMotor);

    async function run() {
      wallTrack.start();
      await setTimeout(10000);
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
