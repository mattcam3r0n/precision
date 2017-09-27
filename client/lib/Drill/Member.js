import { Random } from 'meteor/random';

class Member {
    constructor(dir, x, y) {
        this.id = Random.id();
        this.initialState = {
            x: x,
            y: y,
            direction: dir
        };
		this.currentState = {
			x: x,
			y: y,
			direction: dir,
			count: 0
        };
        this.script = [];
        
    }

    addStep(strideType, stepType, direction, deltaX, deltaY) {
        this.script.push(new ScriptNode(strideType, stepType, direction, deltaX, deltaY));
    }
}

export default Member;