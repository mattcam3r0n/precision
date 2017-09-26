import { Random } from 'meteor/random';
import Direction from '/client/lib/Direction';

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

    addStep(stepType, direction, deltaX, deltaY) {
        this.script.push(new ScriptNode(stepType, direction, deltaX, deltaY));
    }
}

export default Member;