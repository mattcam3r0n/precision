import StrideType from '/client/lib/StrideType';
import StepType from '/client/lib/StepType';
import Direction from '/client/lib/Direction';
import FieldDimensions from '/client/lib/FieldDimensions';

// in pixels. size of canvas. should be defined elsewhere.
var fieldWidth = FieldDimensions.Width,
    fieldHeight = FieldDimensions.Height;    

var sixToFiveDeltaX = fieldWidth / FieldDimensions.widthInSteps(StrideType.SixToFive),
    sixToFiveDeltaY = fieldHeight / FieldDimensions.heightInSteps(StrideType.SixToFive),
    eightToFiveDeltaX = fieldWidth / FieldDimensions.widthInSteps(StrideType.EightToFive),
    eightToFiveDeltaY = fieldHeight / FieldDimensions.heightInSteps(StrideType.EightToFive);

var sixToFiveObliqueDeltaX = sixToFiveDeltaX * 6 / 8,
    sixToFiveObliqueDeltaY = sixToFiveDeltaY * 6 / 8,
    eightToFiveObliqueDeltaX = eightToFiveDeltaX * 8 / 12,
    eightToFiveObliqueDeltaY = eightToFiveDeltaY * 8 / 12;

const deltas = {
    [StrideType.SixToFive]: {
        [StepType.Full]: {
            [Direction.N]: {
                deltaX: 0, deltaY: -sixToFiveDeltaY
            },
            [Direction.E]: {
                deltaX: sixToFiveDeltaX, deltaY: 0
            },
            [Direction.S]: {
                deltaX: 0, deltaY: sixToFiveDeltaY
            },
            [Direction.W]: {
                deltaX: -sixToFiveDeltaX, deltaY: 0
            },
            [Direction.NE]: {
                deltaX: sixToFiveObliqueDeltaX, deltaY: -sixToFiveObliqueDeltaY
            },
            [Direction.SE]: {
                deltaX: sixToFiveObliqueDeltaX, deltaY: sixToFiveObliqueDeltaY
            },
            [Direction.SW]: {
                deltaX: -sixToFiveObliqueDeltaX, deltaY: sixToFiveObliqueDeltaY
            },
            [Direction.NW]: {
                deltaX: -sixToFiveObliqueDeltaX, deltaY: -sixToFiveObliqueDeltaY
            }
        }
    },

    getDelta(strideType, stepType, direction) {
        // TODO: 8/5
        return this[strideType][stepType][direction];
    }
};

export default deltas;