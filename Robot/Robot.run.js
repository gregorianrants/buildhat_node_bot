const Robot = require("./Robot");
const { setTimeout } = require("timers/promises");

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
}

main();
