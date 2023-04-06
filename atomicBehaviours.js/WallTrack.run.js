const { motorFactory } = require("./Motor");
const WallTrack = require("./WallTrack");
const WallTrack = require("./WallTrack");
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

    // let leftMotorSpeed = new MotorSpeed(leftMotor);
    // let rightMotorSpeed = new MotorSpeed(rightMotor);
    let wallTrack = WallTrack(leftMotor, rightMotor);

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

    async function run() {
      wallTrack.start()
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
