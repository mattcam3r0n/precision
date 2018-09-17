import Direction from '/client/lib/Direction';
import StepDelta from '/client/lib/StepDelta';
import { FieldPoint } from '/client/lib/Point';
import StrideType from '/client/lib/StrideType';
import StepType from '/client/lib/StepType';
import Action from '/client/lib/drill/Action';
import MemberPositionCalculator from '/client/lib/drill/MemberPositionCalculator';
import ScriptSequence from '/client/lib/drill/ScriptSequence';

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
  static insertActionAtCount(member, action, count) {
    // get next count
    if (member.script[count] == null) {
      member.script[count] = {
        strideType: member.currentState.strideType,
        stepType: member.currentState.stepType,
        direction: member.currentState.direction,
        deltaX: member.currentState.deltaX,
        deltaY: member.currentState.deltaY,
      };
    }
    // insert the action (push existing to the right)
    member.script.splice(count - 1, 0, action);
    return true;
  }

  static insertActionAndResume(member, action, insertCount, resumeCount) {
    // get action at resumeCount
    let nextAction = member.script[insertCount - 1];
    if (nextAction == null) {
      nextAction = {
        strideType: member.currentState.strideType,
        stepType: member.currentState.stepType,
        direction: member.currentState.direction,
        deltaX: member.currentState.deltaX,
        deltaY: member.currentState.deltaY,
      };
    }
    const counts = resumeCount - insertCount;
    const actions = [action];
    actions[counts] = nextAction;
    // insert the action (push existing to the right)
    member.script.splice(insertCount - 1, 1, ...actions);
    return true;
  }

  static addActionAtCount(member, action, count) {
    // overwrites action at count
    // TODO: ensure action has deltas?

    // don't need to add if member is already in that state
    let state = MemberPositionCalculator.getStateAtCount(member, count);
    if (
      action.stepType != StepType.Halt &&
      action.stepType != StepType.MarkTime &&
      MemberPositionCalculator.areStatesSame(state, action)
    ) {
      return;
    }

    member.script[count - 1] = action;
    return true;
  }

  static addActionAtPoint(member, action, stepPoint) {
    // some way to check whether steppoint is in  current path?
    // calc slope between current and given? ensure that slope is correct for current dir?
    // problem: member may not currently be facing that dir, but eventually will
    // var lineDir = Direction.getLineDirection({ x: member.currentState.x, y: member.currentState.y }, stepPoint );
    // as a temporary solution, calc a rough number of steps and use that as limit?
    let limit = 100; // (Math.abs(member.currentState.x - stepPoint.x) || Math.abs(member.currentState.y - stepPoint.y)) + 2;

    // advance member until at that point (failsafe to prevent infinite loop?)
    //  then add action
    let pos = member.currentState;
    let arePointsEqual = false;
    let stepCount = 0;
    while (stepCount < limit && !arePointsEqual) {
      arePointsEqual = FieldPoint.arePointsEqual(
        {
          x: pos.x,
          y: pos.y,
        },
        stepPoint
      );
      pos = MemberPositionCalculator.stepForward(member, pos);
      stepCount++;
    }

    if (arePointsEqual) {
      return this.addActionAtCount(
        member,
        action,
        member.currentState.count + stepCount
      );
    }
    console.log('addActionAtPoint failed');
    return false;
  }

  static insertSequence(member, sequence, count) {
    // overwrite current script with sequence
    // if undefined, leave original, otherwise replace
    sequence.forEach((a, i) => {
      let index = count - 1 + i;
      if (a !== undefined) {
        member.script[index] = a;
      }
    });
    // member.script.splice(count - 1, sequence.length, ...sequence);
  }

  static deleteActionAtCount(member, count) {
    member.script[count - 1] = null;
  }

  static clearCount(member, count) {
    member.script[count - 1] = null;
  }

  static deleteCount(member, count) {
    // delete count and shift following counts to the left
    member.script.splice(count - 1, 1);
  }

  static deleteCounts(member, count, counts) {
    member.script.splice(count - 1, counts);
  }

  static deleteForward(member, count) {
    if (count >= member.script.length) {
      return;
    }

    for (let i = count; i < member.script.length; i++) {
      member.script[i] = null;
    }
  }

  static deleteBackspace(member, count) {
    if (count >= member.script.length) {
      return;
    }

    member.script[count] = null;
  }

  static getActionAtCount(member, count) {
    let i = count - 1;
    let action = member.script[i];
    while (!action && i >= 0) {
      i--;
      action = member.script[i];
    }
    if (!action) {
      return member.initialState;
    }
    return action;
    //        return member.script[count - 1];
  }

  static getReverseAction(action) {
    if (!action) {
      return action;
    }

    return new Action(action).reverse();
  }

  static addReverseAction(member, countToReverse, countToAdd) {
    // gets the action at count
    // const a = new Action(member.currentState);
    const a = this.getActionAtCount(member, countToReverse);
    // reverses it
    const r = this.getReverseAction(a);
    // adds the reversed action at count + 1 (remember, index of count is count - 1,
    // so count + 1 is at index count)
    member.script[countToAdd] = r;
  }

  // deprecate above?  do this but for 1 count, skip 0?
  static addReverseCounts(member, count, counts, skip) {
    // use MemberPosCalc to step thru counts backward
    // at each count, get state
    // reverse it
    const newSeq = new ScriptSequence();
    // const totalCounts = counts + skip;
    const startCount = count - skip;
    for (let i = startCount; i >= startCount - counts; i--) {
      const state = MemberPositionCalculator.getStateAtCount(member, i);
      newSeq.addStep(this.getReverseAction(state));
    }
    this.insertSequence(member, newSeq.getSequence(), count + 1);
  }

  static fromShorthand(script) {
    // expect something like 'E E E E E E S S S S S S'

    let dirs = script.split(' ');
    let action = {};
    let newScript = [];
    for (let i = 0; i < dirs.length; i++) {
      let dir = Direction[dirs[i]];
      if (action.direction !== dir) {
        let delta = StepDelta.getDelta(
          StrideType.SixToFive,
          StepType.Full,
          dir
        );
        action = {
          direction: dir,
          strideType: StrideType.SixToFive,
          stepType: StepType.Full,
          deltaX: delta.deltaX,
          deltaY: delta.deltaY,
        };
        newScript[i] = action;
      }
    }
    return newScript;
  }
}

export default ScriptBuilder;
