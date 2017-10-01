import { Random } from 'meteor/random';

class Member {
    constructor(dir, point) {
        this.id = Random.id();
        this.initialState = {
            x: point.x,
            y: point.y,
            direction: dir
        };
		this.currentState = {
			x: point.x,
			y: point.y,
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