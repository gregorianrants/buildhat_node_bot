const Avoid = require("./main");
const { setTimeout } = require("timers/promises");


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
