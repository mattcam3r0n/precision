import StrideType from '/client/lib/StrideType';
import StepType from '/client/lib/StepType';
import Direction from '/client/lib/Direction';
import FieldDimensions from '/client/lib/FieldDimensions';

var sixToFiveObliqueDelta = 6 / 8,
    eightToFiveObliqueDelta = 8 / 12;

const deltas = {
        
    [StrideType.SixToFive]: {
        [StepType.Full]: {
            [Direction.N]: {
                deltaX: 0, deltaY: -1
            },
            [Direction.E]: {
                deltaX: 1, deltaY: 0
            },
            [Direction.S]: {
                deltaX: 0, deltaY: 1
            },
            [Direction.W]: {
                deltaX: -1, deltaY: 0
            },
            [Direction.NE]: {
                deltaX: sixToFiveObliqueDelta, deltaY: -sixToFiveObliqueDelta
            },
            [Direction.SE]: {
                deltaX: sixToFiveObliqueDelta, deltaY: sixToFiveObliqueDelta
            },
            [Direction.SW]: {
                deltaX: -sixToFiveObliqueDelta, deltaY: sixToFiveObliqueDelta
            },
            [Direction.NW]: {
                deltaX: -sixToFiveObliqueDelta, deltaY: -sixToFiveObliqueDelta
            }
        }
    },

    [StrideType.EightToFive]: {
        [StepType.Full]: {
            [Direction.N]: {
                deltaX: 0, deltaY: -1
            },
            [Direction.E]: {
                deltaX: 1, deltaY: 0
            },
            [Direction.S]: {
                deltaX: 0, deltaY: 1
            },
            [Direction.W]: {
                deltaX: -1, deltaY: 0
            },
            [Direction.NE]: {
                deltaX: eightToFiveObliqueDelta, deltaY: -eightToFiveObliqueDelta
            },
            [Direction.SE]: {
                deltaX: eightToFiveObliqueDelta, deltaY: eightToFiveObliqueDelta
            },
            [Direction.SW]: {
                deltaX: -eightToFiveObliqueDelta, deltaY: eightToFiveObliqueDelta
            },
            [Direction.NW]: {
                deltaX: -eightToFiveObliqueDelta, deltaY: -eightToFiveObliqueDelta
            }
        }
    },

};

class StepDelta {

    /**
     * 
     * @param {*} strideType 
     * @param {*} stepType 
     * @param {*} direction 
     * @param {*} steps 
     */
    static getDelta(strideType, stepType, direction, steps) {
        strideType = strideType || StrideType.SixToFive;
        stepType = stepType || StepType.Full;
        steps = steps || 1;
        
        if (stepType === StepType.MarkTime || stepType === StepType.Stop) return 0;

        var delta = deltas[strideType][stepType][direction];

        // convert to half steps
        if (stepType === StepType.Half) {
            delta = { 
                deltaX: delta.x / 2, 
                deltaY: delta.y / 2 
            };
        }

        // multiply by steps
        delta = {
            deltaX: delta.deltaX * steps,
            deltaY: delta.deltaY * steps
        };

        return delta;
    }

    static getStepsBetweenPoints(strideType, stepType, a, b) {
        var delta = { x: a.x - b.x, y: a.y - b.y };
        var steps = Math.sqrt(Math.pow(delta.x, 2) + Math.pow(delta.y, 2));
        steps = (strideType == StrideType.EightToFive) ? Math.ceil(steps) : Math.floor(steps);
        return stepType == StepType.Half ? steps * 2 : steps;
    }

    get sixToFiveObliqueDelta() {
        return sixToFiveObliqueDelta;
    }

    get eightToFiveObliqueDelta() {
        return eightToFiveObliqueDelta;
    }
}

export default StepDelta;