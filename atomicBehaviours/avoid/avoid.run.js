const Avoid = require("./Avoid");
const { setTimeout } = require("timers/promises");

console.log(`the velocities i have provided here make the robot trace out a circle with diameter 1m
the translational velocity is set to cover the circumfrence of the circle in 78 seconds
and the rotational velocity is set to make a full rotation in 78 seconds
this results in a circle.
use ctrl + c to stop the robot.
`);

async function main() {
    let avoid = new Avoid();
    
    process
      .on("SIGINT", () => {
        cleanUpAndExit(0);
      })
      .on("uncaughtException", (err) => {
        console.error(err, "Uncaught Exception thrown");
        cleanUpAndExit(1);
      });

    function cleanUpAndExit(exitCode) {
      process.nextTick(() => {
        avoid.cleanUp();
        process.nextTick(() => {
          setTimeout(100).then(() => process.exit(exitCode));
        });
      });
    }

    async function run() {
      await avoid.init()
      await setTimeout(100000);
      cleanUpAndExit();
    }

    await run();
}

main();
