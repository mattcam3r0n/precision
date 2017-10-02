import { Random } from 'meteor/random';

class Member {
    constructor(strideType, dir, point) {
    
        this.id = Random.id();
        this.initialState = {
            x: point.x,
            y: point.y,
            direction: dir,
            strideType: strideType
        };
		this.currentState = {
			x: point.x,
			y: point.y,
            direction: dir,
            strideType: strideType,
			count: 0
        };
        this.script = [];
        
    }

    addStep(strideType, stepType, direction, deltaX, deltaY) {
        this.script.push(new ScriptNode(strideType, stepType, direction, deltaX, deltaY));
    }
}

export default Member;