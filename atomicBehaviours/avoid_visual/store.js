const { MODES,ACTIONS,SIDES,TRANSITIONS } = require("./constants")



function updatePositionState(state,left,right){
  state = {...state}
  state.minValue = Math.min(left,right),
  state.closestSide =  left <= right ? 'left' : 'right'
  return state
}

function getPivotDirection(state){
  const {closestSide} = state
  if(closestSide==SIDES.LEFT){
    return ACTIONS.PIVOT_RIGHT
  }
  if(closestSide==SIDES.RIGHT){
    return ACTIONS.PIVOT_LEFT
  }
  return action
}

function updateStopedState(newState,previousState){
  const {STOPPED_SEARCHING} = TRANSITIONS
  newState = {
    ...newState
  }
  if(newState.minValue> STOPPED_SEARCHING){
    newState.mode = MODES.SEARCHING
    newState.action = getPivotDirection(newState)
    return newState
  }
  return newState
}

function updateSearchingState(newState){
  const {SEARCHING_DRIVING} = TRANSITIONS
  newState = {...newState}
  if(newState.minValue>SEARCHING_DRIVING){
    newState.mode = MODES.DRIVING
    newState.action = ACTIONS.FORWARD
  }
  return newState
}

function updateDrivingState(newState){
  const {DRIVING_SEARCHING} = TRANSITIONS
  newState = {...newState}
  if(newState.minValue<DRIVING_SEARCHING){
    newState.mode = MODES.SEARCHING
    newState.action = getPivotDirection(newState,previousState)
  }
  return newState
}

function reducer(state,left,right){
  previousState = state
  let newState = updatePositionState(state,left,right)
  if(newState.minValue<=TRANSITIONS.ANY_STOPPED) {
    newState.mode=MODES.STOPPED
    newState.action = ACTIONS.STOP
    return newState
  }
  if(previousState.mode === MODES.STOPPED){
    return updateStopedState(newState,previousState)
  }
  if(previousState.mode === MODES.SEARCHING){
    return updateSearchingState(newState)
  }
  if(previousState.mode ===MODES.DRIVING){
    return updateDrivingState(newState)
  }
  return newState
}


//we maintain state in here rather than using state from user of module as we require the previous state to make updates
//this may not be strictly necessary,
function store(){
  let state = {
    mode: MODES.STOPPED,
    minValue: null,
    closestSide: null,
    action: null,
  }

  function getState(){
    return state
  }

  function updateState(left,right){
    state = reducer(state,left,right)
  }

  function addListner(){

  }

  return {getState,updateState,addListner}

  
}






module.exports = store