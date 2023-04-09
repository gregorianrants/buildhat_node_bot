const { distance } = require("mathjs");
const distanceSensors = require("./DistanceSensors");

distanceSensors.start(2000);

distanceSensors.on("distances", console.log);
