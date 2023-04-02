const {DistanceSensor} = require('./DistanceSensor')

class DistanceSensorGroup{
  constructor(distanceSensors){
    this.distanceSensors = distanceSensors
    this.index = 0
  }

  updateIndex(){
    this.index =  (this.index+1)%this.distanceSensors.length
  }

  read(){
    this.distanceSensors[this.index].read()
    setInterval(()=>{
      this.updateIndex()
      this.distanceSensors[this.index].read()
    },500)
  }
}

const pinNumbers = [
  {triggerPin: 27,echoPin: 22, sensorName: '0'},
  {triggerPin: 23,echoPin: 24, sensorName: '1'},
  {triggerPin: 6,echoPin: 16, sensorName: '2'},
  {triggerPin: 21,echoPin: 20, sensorName: '3'},
  {triggerPin: 26,echoPin: 19, sensorName: '4'}
]

const distanceSensorGroup = new DistanceSensorGroup(
  [new DistanceSensor(pinNumbers[1])]
)


distanceSensorGroup.read()