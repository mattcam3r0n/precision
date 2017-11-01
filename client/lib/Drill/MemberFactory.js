import { Random } from 'meteor/random';
import StepDelta from '/client/lib/StepDelta';
import StepType from '/client/lib/StepType';

class MemberFactory {
    static createMember(strideType, dir, point) { 
        var newMember = {};
        var stepType = StepType.Full; // TODO: add stepType arg?
        var delta = StepDelta.getDelta(strideType, stepType, dir);

        newMember.id = Random.id();
        newMember.initialState = {
            x: point.x,
            y: point.y,
            direction: dir,
            strideType: strideType,
            deltaX: delta.deltaX,
            deltaY: delta.deltaY
        };
		newMember.currentState = {
			x: point.x,
			y: point.y,
            direction: dir,
            strideType: strideType,
            deltaX: delta.deltaX,
            deltaY: delta.deltaY,
			count: 0
        };
        newMember.script = [];
        newMember.isVisible = true;
        newMember.isSelected = false;
        
        return newMember;
    }
}

export default MemberFactory;