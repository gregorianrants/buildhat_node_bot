
const MODES = {
    STOPPED : 'stopped',
    SEARCHING : 'searching',
    DRIVING : 'driving'
  }
  
  const ACTIONS = {
    FORWARD :'forward',
    STOP : 'stop',
    PIVOT_LEFT: 'pivot-left',
    PIVOT_RIGHT: 'pivot-right'
  }
  
  const SIDES = {
    LEFT: 'left',
    RIGHT: 'right'
  }
  
  // const TRANSITIONS ={
  //   STOPPED_SEARCHING: 100,
  //   SEARCHING_DRIVING: 140,
  //   DRIVING_SEARCHING: 100,
  //   ANY_STOPPED: 50
  // }

  const TRANSITIONS ={
    STOPPED_SEARCHING: 50,
    SEARCHING_DRIVING: 370,
    DRIVING_SEARCHING: 200,
    ANY_STOPPED: 10
  }
  
  
  module.exports = {
    MODES,
    ACTIONS,
    SIDES,
    TRANSITIONS
  }