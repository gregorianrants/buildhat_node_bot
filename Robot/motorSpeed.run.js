const { motorFactory } = require("./Motor");
const MotorSpeed = require("./MotorSpeed");
const { setTimeout } = require("timers/promises");

function next(f) {
  () => {
    process.nextTick(f);
  };
}

async function main() {
  console.log("asdfsadfsdfsdf");

  try {
    let leftMotorSpeed = new MotorSpeed('C','left');
    let rightMotorSpeed = new MotorSpeed('D','right');
    await leftMotorSpeed.init()
    await rightMotorSpeed.init()

    process
      .on("SIGINT", () => {
        cleanUpAndExit();
      })
      .on("uncaughtException", (err) => {
        console.error(err, "Uncaught Exception thrown");
        cleanUpAndExit();
      });

    function cleanUpAndExit() {
      process.nextTick(() => {
          leftMotorSpeed.cleanUp();
          rightMotorSpeed.cleanUp();
          setTimeout(500).then(() => process.exit(0));
      });
    }

    async function run() {
      console.log('in run')
      leftMotorSpeed.setPoint=500;
      rightMotorSpeed.setPoint=500;
      await setTimeout(3000);
      cleanUpAndExit();
    }
   
    await run();

    
  } catch (error) {
    console.log(error);
    cleanUpAndExit();
  }
}

main();
