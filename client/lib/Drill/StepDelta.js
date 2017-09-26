import StrideType from '/client/lib/StrideType';
import StepType from '/client/lib/StepType';
import Direction from '/client/lib/Direction';

// in pixels. size of canvas. should be defined elsewhere.
var fieldWidth = 1560,
    fieldHeight = 780;

/*
*
* 6/5 and 8/5 steps across field
*
*						  156 / 208
* -----------------------------------------------------------
* |                       6 / 8                             |
* |   ---------------------------------------------------   |
* |   |    | | | | | | | | | | | | | | | | | | | | |    |   |
* |   |    | | | | | | | | | | | | | | | | | | | | |    |   |
* | 6 | 12 |6|6|6|6|6|6|6|6|6|6|6|6|6|6|6|6|6|6|6|6| 12 | 6 | 78
* |   |    | | | | | | | | | | | | | | | | | | | | |    |   |
* | 8 | 16 |8|8|8|8|8|8|8|8|8|8|8|8|8|8|8|8|8|8|8|8| 16 | 8 | 90
* |   |    | | | | | | | | | | | | | | | | | | | | |    |   |
* |   |    | | | | | | | | | | | | | | | | | | | | |    |   |
* |   ---------------------------------------------------   |
* |                       6 / 8                             |   
* -----------------------------------------------------------
*
*/
    

var sixToFiveFieldStepWidth = 156,
    sixToFiveFieldStepHeight = 78,
    eightToFiveFieldStepWidth = 208,
    eightToFiveFieldStepHeight = 90;

var sixToFiveDeltaX = fieldWidth / sixToFiveFieldStepWidth,
    sixToFiveDeltaY = fieldHeight / sixToFiveFieldStepHeight,
    eightToFiveDeltaX = fieldWidth / eightToFiveFieldStepWidth,
    eightToFiveDeltaY = fieldHeight / eightToFiveFieldStepHeight;

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