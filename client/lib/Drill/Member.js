import { Random } from 'meteor/random' 

class Member {
    constructor() {
        this.id = Random.id();
        this.initialState = {
            x: 0,
            y: 0,
            direction: 'E'
        };
		this.currentState = {
			x: 6,
			y: 6,
			direction: 'E',
			count: 0
        };
        this.script = [];
        
    }

    addStep(stepType, direction, deltaX, deltaY) {

    }
}

export default Member;