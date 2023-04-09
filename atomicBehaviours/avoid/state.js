const { NAMES } = require("../../distanceSensors/constants");

function minLeft(distances) {
  return Math.min(distances[NAMES.LEFT], distances[NAMES.FRONT_LEFT]);
}

function minRight(distances) {
  return Math.min(distances[NAMES.RIGHT], distances[NAMES.FRONT_RIGHT]);
}

function minAll(distances) {
  return Math.min(...Object.values(distances));
}

function middle(distances) {
  return distances[NAMES.MIDDLE];
}

const STATE_NAMES = {
  DRIVE_FREE: "DRIVE_FREE",
  AVOID_LEFT: "AVOID_LEFT",
  AVOID_RIGHT: "AVOID_RIGHT",
  STOPPED: "STOPPED",
};

const ZONES = {
  GREEN_TO_AMBER: 50,
  AMBER_TO_GREEN: 90,
  DIFFERENCE_REQURIED_TO_SWITCH_AVOIDENCE_SIDE: 10,
};

const transitions = {
  ALL: (distances) => {
    if (minAll(distances) < 7) {
      return STATE_NAMES.STOPPED;
    }
    return false;
  },
  DRIVE_FREE: (distances) => {
    if (minAll(distances) > ZONES.GREEN_TO_AMBER) return STATE_NAMES.DRIVE_FREE;
    if (minLeft(distances) > minRight(distances)) {
      return STATE_NAMES.AVOID_LEFT;
    }
    return STATE_NAMES.AVOID_RIGHT;
  },
  AVOID_LEFT: (distances) => {
    if (minAll(distances) > ZONES.AMBER_TO_GREEN) return STATE_NAMES.DRIVE_FREE;
    if (
      minLeft(distances) <
      minRight(distances) - ZONES.DIFFERENCE_REQURIED_TO_SWITCH_AVOIDENCE_SIDE
    ) {
      return STATE_NAMES.AVOID_RIGHT;
    }
    return STATE_NAMES.AVOID_LEFT;
  },
  AVOID_RIGHT: (distances) => {
    if (minAll(distances) > ZONES.AMBER_TO_GREEN) return STATE_NAMES.DRIVE_FREE;
    if (
      minRight(distances) <
      minLeft(distances) - ZONES.DIFFERENCE_REQURIED_TO_SWITCH_AVOIDENCE_SIDE
    ) {
      return STATE_NAMES.AVOID_LEFT;
    }
    return STATE_NAMES.AVOID_RIGHT;
  },
  STOPPED: (distances) => {
    return false;
  },
};

function rotationsPerSecond({ rotations, direction }) {
  const radiansPerSecond = rotations * (2 * Math.PI);
  return direction === "left" ? radiansPerSecond : -1 * radiansPerSecond;
}

function proportionAcrossZone(distanceToObstacle) {
  const distanceAcrossZone = ZONES.AMBER_TO_GREEN - distanceToObstacle;
  return distanceAcrossZone / ZONES.AMBER_TO_GREEN;
}

const handler = {
  DRIVE_FREE: (distances) => ({
    translation: 300,
    rotation: 0,
  }),
  AVOID_LEFT: (distances) => {
    return {
      translation: (1 - proportionAcrossZone(minAll(distances))) * 300,
      rotation: rotationsPerSecond({
        rotations: proportionAcrossZone(minAll(distances)) * 0.5,
        direction: "left",
      }),
    };
  },
  AVOID_RIGHT: (distances) => {
    return {
      translation: (1 - proportionAcrossZone(minAll(distances))) * 300,
      rotation: rotationsPerSecond({
        rotations: proportionAcrossZone(minAll(distances)) * 0.5,
        direction: "right",
      }),
    };
  },
};

let state = STATE_NAMES.DRIVE_FREE;

function update(distances) {
  if (transitions["ALL"](distances) == STATE_NAMES.STOPPED) {
    return {
      state: "stopped",
      translation: 0,
      rotation: 0,
    };
  }
  state = transitions[state](distances);
  result = handler[state](distances);
  return { ...result, state };
}

module.exports = {
  update,
};
