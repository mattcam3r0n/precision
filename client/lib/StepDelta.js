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

    static getDelta(strideType, stepType, direction) {
        strideType = strideType || StrideType.SixToFive;
        stepType = stepType || StepType.Full;
        
        if (stepType === StepType.MarkTime || stepType === StepType.Stop) return 0;

        var delta = deltas[strideType][stepType][direction];

        if (stepType === StepType.Half)
            return { x: delta.x / 2, y: delta.y / 2 };

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