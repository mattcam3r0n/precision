import FieldDimensions from '/client/lib/FieldDimensions';
import StepDelta from '/client/lib/StepDelta';
import StepType from '/client/lib/StepType';
import StrideType from '/client/lib/StrideType';
// import Action from './Action';

/**
 * Calculates count/position of a single member, relative to current position,
 * BUT DOES NOT CHANGE STATE
 */

class MemberPositionCalculator {
    static areStatesSame(state1, state2) {
        return state1 && state2
            && state1.strideType == state2.strideType
            && state1.stepType == state2.stepType
            && state1.direction == state2.direction
            && state1.deltaX == state2.deltaX
            && state1.deltaY == state2.deltaY;
    }

    static arePositionsSame(pos1, pos2) {
        return pos1 && pos2
            && this.areStatesSame(pos1, pos2)
            && pos1.x == pos2.x
            && pos1.y == pos2.y;
    }

    /**
     * Get a member's state at a given count.  If there is no Action at that
     * count in the member's script, look backward to most recent Action to
     * determine the current state (as of count).
     *
     * @param {Member} member A member object.
     * @param {Number} count  Count in drill.
     *
     * @return {Object} state A state object.
     */
    static getStateAtCount(member, count) {
        let i = count - 1;
        let state = member.script[i];
        while (!state && i >= 0) {
            i--;
            state = member.script[i];
        }
        if (!state) {
            return Object.assign({}, member.initialState);
        }
        return state;
    }

    static getPositionAtCount(member, count) {
        return this.goToCount(member, count);
    }

    static getState(member, count) {
        let newState;

        // get state at this count
        newState = this.getStateAtCount(member, count);

        // ensure that we have deltas for this state
        let delta = (newState.deltaX != undefined
            && newState.deltaY != undefined)
            ? { deltaX: newState.deltaX, deltaY: newState.deltaY }
            : StepDelta.getDelta(newState.strideType,
                newState.stepType,
                newState.direction);

        // return state object
        return {
            strideType: newState.strideType || StrideType.SixToFive,
            stepType: newState.stepType || StepType.Full,
            direction: newState.direction,
            deltaX: delta.deltaX,
            deltaY: delta.deltaY,
            count: count,
        };
    }

    /**
     * Apply an Action to the current state and return new state.
     * @param {Object} currentState The current state, which will be modified by Action.
     * @param {Object} action The action to perform.
     * @return {Object} The new state.
     */
    static doAction(currentState, action) {
        // TODO: need to account for 8/5 adjustment at some point
        return {
            strideType: action.strideType || StrideType.SixToFive,
            stepType: action.stepType || StepType.Full,
            direction: action.direction,
            deltaX: action.deltaX,
            deltaY: action.deltaY,
            count: currentState.count + 1,
            x: currentState.x + action.deltaX,
            y: currentState.y + action.deltaY,
        };
    }

    /**
     * Undo (subtract) an Action from the current state and return new state.
     * @param {Object} currentState The current state, which will be modified by Action.
     * @param {Object} previousState The previous state
     * @param {Object} action The action to perform.
     * @return {Object} The new state.
     */
    static undoAction(currentState, previousState, action) {
        // TODO: need to account for 8/5 adjustment at some point
        // NOTE: This requires us to have the previous state, and we're only
        // changing the position. is there some other way?
        return {
            strideType: previousState.strideType || StrideType.SixToFive,
            stepType: previousState.stepType || StepType.Full,
            direction: previousState.direction,
            deltaX: previousState.deltaX,
            deltaY: previousState.deltaY,
            count: currentState.count - 1,
            x: currentState.x - action.deltaX,
            y: currentState.y - action.deltaY,
        };
    }

    static stepForward(member, currentState, steps) {
        steps = steps || 1;

        let newState;

        for (let i = 0; i < steps; i++) {
            currentState = currentState || Object.assign({},
                member.currentState);
            newState = this.getState(member, currentState.count + 1);

            newState.x = currentState.x + newState.deltaX;
            newState.y = currentState.y + newState.deltaY;

            if (this.needs8to5Adjustment(newState)) {
                newState.y = currentState.y + this.adjustedDeltaY(newState);
            }

            currentState = newState;
        }

        // if (this.isBeyondEndOfDrill(member, position))
        //     return position;

        return newState;
    }

    static stepBackward(member, currentState, steps) {
        steps = steps || 1;

        // let currentState;
        let newState;

        for (let i = 0; i < steps; i++) {
            currentState = currentState || Object.assign({},
                member.currentState);

            if (this.isBeginningOfDrill(member, currentState)) {
                return currentState;
            }

            // if (this.isBeyondEndOfDrill(member, position)) {
            //     position.count--;
            //     return position;
            // }

            // get the new state at count - 1, undo the currentState x,y
            newState = this.getState(member, currentState.count - 1);
            newState.x = currentState.x - currentState.deltaX;
            newState.y = currentState.y - currentState.deltaY;

            // when stepping backward, check adjustment based on
            // currentState.
            if (!this.isBeginningOfDrill(member, newState)
                    && this.needs8to5Adjustment(currentState)) {
                newState.y = currentState.y - this.adjustedDeltaY(newState);
            }

            currentState = newState;
        }


        return newState;
    }

    static needs8to5Adjustment(state) {
        if (state.strideType == StrideType.EightToFive
            && state.deltaY > 0
            && this.isBetweenHashes(state)) {
            return true;
        }
        return false;
    }

    static adjustedDeltaY(state) {
        if (state.deltaY > 0
            && state.deltaX == 0) {
            return FieldDimensions.oneStepY_8to5_Adj;
        }
        if (state.deltaY > 0
            && state.deltaX > 0) {
            return FieldDimensions.eightToFiveObliqueDeltaY;
        }
        return state.deltaY;
    }

    static isBetweenHashes(state) {
        return (state.y >= FieldDimensions.farHashY
            && state.y <= FieldDimensions.nearHashY);
    }

    static isBeginningOfDrill(member, position) {
        return position.count === 0;
    }

    static isEndOfDrill(member, currentState) {
        currentState = currentState || member.currentState;

        return this.isAtFieldEdge(member, currentState)
            || (currentState.count >= member.script.length
                && this.isNonMovingState(currentState));
    }

    static isNonMovingState(currentState) {
        return (currentState.deltaX === 0 && currentState.deltaY === 0);
    }

    static isAtFieldEdge(member, currentState) {
        currentState = currentState || member.currentState;

        return currentState.x >= 1560
            || currentState.y >= 780
            || currentState.x <= 0
            || currentState.y <= 0;
    }

    static isBeyondEndOfDrill(member, currentState) {
        currentState = currentState || member.currentState;
        return currentState.count > member.script.length;
    }

    static goToBeginning(member) {
        return this.getState(member, member.currentState, 0);
        // var position = Object.assign({}, member.currentState);

        // position.count = 0;
        // position.direction = member.initialState.direction;
        // position.x = member.initialState.x;
        // position.y = member.initialState.y;

        // return position;
    }

    static goToEnd(member, currentState) {
        currentState = currentState || Object.assign({}, member.currentState);
        while (!this.isEndOfDrill(member, currentState)) {
            currentState = this.stepForward(member, currentState);
        }
        return currentState;
    }

    static goToCount(member, goToCount, currentState) {
        currentState = currentState || Object.assign({},
            member.currentState);
        if (goToCount < member.currentState.count) {
            while (goToCount < currentState.count) {
                currentState = this.stepBackward(member, currentState);
            }
        } else {
            while (goToCount > currentState.count) {
                currentState = this.stepForward(member, currentState);
            }
        }

        return currentState;
    }
}

export default MemberPositionCalculator;
