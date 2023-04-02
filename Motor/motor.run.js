const { motorFactory } = require("./Motor");
const { setTimeout } = require("timers/promises");

async function main() {
  console.log("asdfsadfsdfsdf");

  try {
    let motor = await motorFactory("C", "left");

    
    function cleanUpAndExit() {
      motor.cleanUp();
      setTimeout(500).then(() => process.exit(0));
    }

    motor.pwm = 20;

    await setTimeout(2000);
   
    motor.pwm = 0


    await setTimeout(200);

    cleanUpAndExit();

    // motor.on("encoder", (data) => {
    //   console.log(data);
    // });

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
