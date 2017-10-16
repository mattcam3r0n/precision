import StepDelta from '/client/lib/StepDelta';
import FieldPoint from '/client/lib/FieldPoint';
import MemberPositionCalculator from '/client/lib/drill/MemberPositionCalculator';

/**
 * 
 * Action
 * { 
 *      strideType,
 *      stepType
 *      direction,
 *      deltaX, // can be inferred from above, but convenient
 *      deltaY
 * }
 * 
 */

// class Action {
//     constructor(strideType, stepType, direction) {
//         this.strideType = strideType;
//         this.stepType = stepType;
//         this.direction = direction;
//     }
// }

class ScriptBuilder {
    
    static addActionAtCount(member, action, count) {
        // TODO: ensure action has deltas?
        member.script[count - 1] = action;
    }

    static addActionAtPoint(member, action, stepPoint) {
        // some way to check whether steppoint is in  current path?
            // calc slope between current and given? ensure that slope is correct for current dir?
            // problem: member may not currently be facing that dir, but eventually will
        // var lineDir = Direction.getLineDirection({ x: member.currentState.x, y: member.currentState.y }, stepPoint );
        // as a temporary solution, calc a rough number of steps and use that as limit?
        var limit = (Math.abs(member.currentState.x - stepPoint.x) || Math.abs(member.currentState.y - stepPoint.y)) + 2;

        // advance member until at that point (failsafe to prevent infinite loop?)
        //  then add action
        var pos = member.currentState;
        var arePointsEqual = false;
        var stepCount = 0;
        while(stepCount < limit && !arePointsEqual) {
            arePointsEqual = FieldPoint.arePointsEqual({ x: pos.x, y: pos.y }, stepPoint);
            pos = MemberPositionCalculator.stepForward(member, pos);
            stepCount++;
        }

        if (arePointsEqual) {
            this.addActionAtCount(member, action, member.currentState.count + stepCount);
        }
    }
}

export default ScriptBuilder;
