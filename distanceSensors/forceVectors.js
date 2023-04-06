const math = require('mathjs')
console.log('math imported')

//angles of vectors normal to sensors
//remember x axis point forwards and y axis to left rotation is clockwise from x to y
//middle sensor points forwards
const angles = [2*(Math.PI/6),0,(Math.pi/6),-(Math.PI/6),2*-(Math.PI/6)]

//vector normal to middle sensor is i unit vecotor [1,0] remember x points up
// other vectors can be obtained by rotating this vector


function rotation(angle,vector){
const rotationMatrix = math.matrix([
  [math.cos(angle),-math.sin(angle)],
  [math.sin(angle),math.cos(angle)]])
return math.multiply(rotationMatrix,vector)
}

function getNormalsToSensors(){
  const ihat = math.matrix([[1],[0]])
  return angles.map(angle=>rotation(angle,ihat))[0]
}

function getForceVector(){
  
}

console.log(getNormalsToSensors())

