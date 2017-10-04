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
        if (stepType === StepType.MarkTime || stepType === StepType.Stop) return 0;

        var delta = deltas[strideType][stepType][direction];

        if (stepType === StepType.Half)
            return { x: delta.x / 2, y: delta.y / 2 };

        return delta;
    }

    get sixToFiveObliqueDelta() {
        return sixToFiveObliqueDelta;
    }

    get eightToFiveObliqueDelta() {
        return eightToFiveObliqueDelta;
    }
}

export default StepDelta;