const { distance } = require("mathjs");
const DistanceSensors = require("./DistanceSensors");

const distanceSensors = DistanceSensors();

distanceSensors.start();

distanceSensors.on("distances", console.log);
