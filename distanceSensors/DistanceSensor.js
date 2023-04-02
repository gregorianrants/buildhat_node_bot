const Gpio = require('pigpio').Gpio;

// The number of microseconds it takes sound to travel 1cm at 20 degrees celcius
const MICROSECDONDS_PER_CM = 1e6/34321;


class DistanceSensor{
  constructor({triggerPin,echoPin,sensorName}){
    this.startTick = null
    this.endTick = null
    this.triggerPin = triggerPin
    this.echoPin = echoPin
    this.trigger = new Gpio(this.triggerPin, {mode: Gpio.OUTPUT});
    this.echo = new Gpio(this.echoPin, {mode: Gpio.INPUT, alert: true});

    this.echo.on('alert', (level, tick) => {

      if (level == 1) {
        this.startTick = tick;
      } else {
        const endTick = tick;
        const diff = (endTick >> 0) - (this.startTick >> 0); // Unsigned 32 bit arithmetic
        console.log(`sensor ${sensorName}`,diff / 2 / MICROSECDONDS_PER_CM);
      }
    });
  }

  read(){
    this.trigger.digitalWrite(0)
    this.trigger.trigger(10,1)
  }
}

// let distanceSensor2 = new DistanceSensor({triggerPin: 21,echoPin: 20, sensorName: '2'})

// // Trigger a distance measurement once per second
// setInterval(() => {
//   distanceSensor2.read(); // Set trigger high for 10 microseconds
// }, 100);

module.exports = {DistanceSensor}