const { motorFactory } = require("./Motor/Motor");
const { setTimeout } = require("timers/promises");
const Avoid = require("./atomicBehaviours/avoid/Avoid");

async function run({ Behaviour, forSeconds = 5 }) {
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

  async function run() {
    behaviour.start();
    // if (forSeconds) {
    //   await setTimeout(forSeconds * 1000);
    //   console.log("after");
    //   cleanUpAndExit();
    // }
  }

  try {
    process
      .on("SIGINT", () => {
        cleanUpAndExit();
      })
      .on("uncaughtException", (err) => {
        console.error(err, "Uncaught Exception thrown");
        cleanUpAndExit();
        process.exit(1);
      });

    await run();
  } catch {
    console.error(error);
    cleanUpAndExit();
  }
}

run({ Behaviour: Avoid }, (forSeconds = 150));
