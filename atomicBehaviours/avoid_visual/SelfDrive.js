class SelfDrive{
    constructor(motors){
            this.motorsState = MODES.STOPPED
            this.state = null
            this.previousAction = null
            this.nextAction = ACTIONS.STOP
            this.running = false 
            this.motors = motors
            this.store = store()
            this.distance_listner = redis_s
            //console.log(this.motors)
    }

    resetState(){
            this.store = store()
            this.previousAction = null
            this.nextAction = ACTIONS.STOP
    }

    handleNewData(left,right){
            console.log(left,right)
            this.store.updateState(left,right)
            this.nextAction = this.store.getState().action
            console.log(this.store.getState())
            if(this.nextAction!==this.previousAction){
                    this.handleAction()
                    this.previousAction = this.nextAction
            }
    }

    handleAction(){
            console.log('action has changed')
            console.log(this.nextAction)
            if(this.nextAction == ACTIONS.FORWARD){
                    this.motors.forward(60)
            }
            if(this.nextAction ==ACTIONS.PIVOT_LEFT){
                    this.motors.pivotLeft(80)
            }
            if(this.nextAction ==ACTIONS.PIVOT_RIGHT){
                    this.motors.pivotRight(80)
            }
            if(this.nextAction ==ACTIONS.STOP){
                    this.motors.stop()
            }
    }

    startSelfDrive(){
            this.distance_listner.subscribe(DISTANCE_CHANNEL)
            this.distance_listner.on('message',(channel,message)=>{
                    const {left,right} = JSON.parse(message)
                    this.handleNewData(left,right)
            })
    }

    async stopSelfDrive(){
            await this.distance_listner.unsubscribe(DISTANCE_CHANNEL)
            this.resetState()
            this.handleAction()
            console.log('unsubscribed')
    }
    
}



module.exports = SelfDrive