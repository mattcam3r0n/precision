import Direction from '/client/lib/Direction';
import StepDelta from '/client/lib/StepDelta';
import { FieldPoint } from '/client/lib/Point';
import StrideType from '/client/lib/StrideType';
import StepType from '/client/lib/StepType';
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

        // don't need to add if member is already in that state
        var state = MemberPositionCalculator.getStateAtCount(member, count);
        if (MemberPositionCalculator.areStatesSame(state, action))
            return;

        member.script[count - 1] = action;
        return true;
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
            return this.addActionAtCount(member, action, member.currentState.count + stepCount);
        }

        return false;
    }

    static fromShorthand(script) {
        // expect something like 'E E E E E E S S S S S S'

        var dirs = script.split(' ');
        var action = {};
        var newScript = [];
        for (var i = 0; i < dirs.length; i++) {
            let dir = Direction[dirs[i]];
            if (action.direction !== dir) {
                let delta = StepDelta.getDelta(StrideType.SixToFive, StepType.Full, dir);
                action = {
                    direction: dir,
                    strideType: StrideType.SixToFive,
                    stepType: StepType.Full,
                    deltaX: delta.deltaX,
                    deltaY: delta.deltaY    
                };
                newScript[i] = action;
            }
        }
        return newScript;
    }

}

export default ScriptBuilder;
