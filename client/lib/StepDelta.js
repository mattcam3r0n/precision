import StrideType from '/client/lib/StrideType';
import StepType from '/client/lib/StepType';
import Direction from '/client/lib/Direction';
import FieldDimensions from '/client/lib/FieldDimensions';

const deltas = {

    [StrideType.SixToFive]: {
        [StepType.Full]: {
            [Direction.N]: {
                deltaX: 0, deltaY: -1 * FieldDimensions.oneStepY_6to5,
            },
            [Direction.E]: {
                deltaX: 1 * FieldDimensions.oneStepX_6to5, deltaY: 0,
            },
            [Direction.S]: {
                deltaX: 0, deltaY: 1 * FieldDimensions.oneStepY_6to5,
            },
            [Direction.W]: {
                deltaX: -1 * FieldDimensions.oneStepX_6to5, deltaY: 0,
            },
            [Direction.NE]: {
                deltaX: FieldDimensions.sixToFiveObliqueDeltaX,
                deltaY: -FieldDimensions.sixToFiveObliqueDeltaY,
            },
            [Direction.SE]: {
                deltaX: FieldDimensions.sixToFiveObliqueDeltaX,
                deltaY: FieldDimensions.sixToFiveObliqueDeltaY,
            },
            [Direction.SW]: {
                deltaX: -FieldDimensions.sixToFiveObliqueDeltaX,
                deltaY: FieldDimensions.sixToFiveObliqueDeltaY,
            },
            [Direction.NW]: {
                deltaX: -FieldDimensions.sixToFiveObliqueDeltaX,
                deltaY: -FieldDimensions.sixToFiveObliqueDeltaY,
            },
        },
        [StepType.Half]: {
            [Direction.N]: {
                deltaX: 0, deltaY: -0.5 * FieldDimensions.oneStepY_6to5,
            },
            [Direction.E]: {
                deltaX: 0.5 * FieldDimensions.oneStepX_6to5, deltaY: 0,
            },
            [Direction.S]: {
                deltaX: 0, deltaY: 0.5 * FieldDimensions.oneStepY_6to5,
            },
            [Direction.W]: {
                deltaX: -0.5 * FieldDimensions.oneStepX_6to5, deltaY: 0,
            },
            [Direction.NE]: {
                deltaX: FieldDimensions.sixToFiveObliqueDeltaX / 2,
                deltaY: -FieldDimensions.sixToFiveObliqueDeltaY / 2,
            },
            [Direction.SE]: {
                deltaX: FieldDimensions.sixToFiveObliqueDeltaX / 2,
                deltaY: FieldDimensions.sixToFiveObliqueDeltaY / 2,
            },
            [Direction.SW]: {
                deltaX: -FieldDimensions.sixToFiveObliqueDeltaX / 2,
                deltaY: FieldDimensions.sixToFiveObliqueDeltaY / 2,
            },
            [Direction.NW]: {
                deltaX: -FieldDimensions.sixToFiveObliqueDeltaX / 2,
                deltaY: -FieldDimensions.sixToFiveObliqueDeltaY / 2,
            },
        },
    },

    [StrideType.EightToFive]: {
        [StepType.Full]: {
            [Direction.N]: {
                deltaX: 0, deltaY: -1 * FieldDimensions.oneStepY_8to5,
            },
            [Direction.E]: {
                deltaX: 1 * FieldDimensions.oneStepX_8to5, deltaY: 0,
            },
            [Direction.S]: {
                deltaX: 0, deltaY: 1 * FieldDimensions.oneStepY_8to5,
            },
            [Direction.W]: {
                deltaX: -1 * FieldDimensions.oneStepX_8to5, deltaY: 0,
            },
            [Direction.NE]: {
                deltaX: FieldDimensions.eightToFiveObliqueDeltaX,
                deltaY: -FieldDimensions.eightToFiveObliqueDeltaY,
            },
            [Direction.SE]: {
                deltaX: FieldDimensions.eightToFiveObliqueDeltaX,
                deltaY: FieldDimensions.eightToFiveObliqueDeltaY,
            },
            [Direction.SW]: {
                deltaX: -FieldDimensions.eightToFiveObliqueDeltaX,
                deltaY: FieldDimensions.eightToFiveObliqueDeltaY,
            },
            [Direction.NW]: {
                deltaX: -FieldDimensions.eightToFiveObliqueDeltaX,
                deltaY: -FieldDimensions.eightToFiveObliqueDeltaY,
            },
        },
        [StepType.Half]: {
            [Direction.N]: {
                deltaX: 0, deltaY: -0.5 * FieldDimensions.oneStepY_8to5,
            },
            [Direction.E]: {
                deltaX: 0.5 * FieldDimensions.oneStepX_8to5, deltaY: 0,
            },
            [Direction.S]: {
                deltaX: 0, deltaY: 0.5 * FieldDimensions.oneStepY_8to5,
            },
            [Direction.W]: {
                deltaX: -0.5 * FieldDimensions.oneStepX_8to5, deltaY: 0,
            },
            [Direction.NE]: {
                deltaX: FieldDimensions.eightToFiveObliqueDeltaX / 2,
                deltaY: -FieldDimensions.eightToFiveObliqueDeltaY / 2,
            },
            [Direction.SE]: {
                deltaX: FieldDimensions.eightToFiveObliqueDeltaX / 2,
                deltaY: FieldDimensions.eightToFiveObliqueDeltaY / 2,
            },
            [Direction.SW]: {
                deltaX: -FieldDimensions.eightToFiveObliqueDeltaX / 2,
                deltaY: FieldDimensions.eightToFiveObliqueDeltaY / 2,
            },
            [Direction.NW]: {
                deltaX: -FieldDimensions.eightToFiveObliqueDeltaX / 2,
                deltaY: -FieldDimensions.eightToFiveObliqueDeltaY / 2,
            },
        },
    },

};

class StepDelta {
    static getDelta(strideType, stepType, direction, steps) {
        strideType = strideType || StrideType.SixToFive;
        stepType = stepType || StepType.Full;
        steps = steps || 1;

        if (stepType === StepType.MarkTime || stepType === StepType.Halt) {
            return {
                deltaX: 0,
                deltaY: 0,
            };
        }

        let delta = deltas[strideType][stepType][direction];

        // convert to half steps
        // if (stepType === StepType.Half) {
        //     delta = {
        //         deltaX: delta.x / 2,
        //         deltaY: delta.y / 2
        //     };
        // }

        // multiply by steps
        delta = {
            deltaX: delta.deltaX * steps,
            deltaY: delta.deltaY * steps,
        };

        return delta;
    }

    static getStepsBetweenPoints(strideType, stepType, direction, a, b) {
        if (Direction.isOblique(direction)) {
            a = {x: a.x, y: a.y};
            b = {x: b.x, y: a.y};
        }
        const delta = {x: a.x - b.x, y: a.y - b.y};
        const distance = Math.sqrt(Math.pow(delta.x, 2) + Math.pow(delta.y, 2));

        const stepSize = this.getDelta(strideType, stepType, direction);
        const steps = Math.abs(stepSize.deltaX == 0
            ? distance / stepSize.deltaY
            : distance / stepSize.deltaX);
        return stepType == StepType.Half ? steps * 2 : steps;
    }
}

export default StepDelta;
