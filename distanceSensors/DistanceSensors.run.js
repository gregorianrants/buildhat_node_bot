const {DistanceSensorGroup} = require('./DistanceSensors')
const {DistanceSensor} = require('./DistanceSensor')

const pinNumbers = [
  {triggerPin: 27,echoPin: 22, sensorName: '0'},
  {triggerPin: 23,echoPin: 24, sensorName: '1'},
  {triggerPin: 6,echoPin: 16, sensorName: '2'},
  {triggerPin: 21,echoPin: 20, sensorName: '3'},
  {triggerPin: 26,echoPin: 19, sensorName: '4'}
]

const distanceSensorGroup = new DistanceSensorGroup(
  [new DistanceSensor(pinNumbers[3])]
)


distanceSensorGroup.read()