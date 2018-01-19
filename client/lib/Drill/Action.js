import StrideType from '/client/lib/StrideType';
import StepType from '/client/lib/StepType';
import Direction from '/client/lib/Direction';
import StepDelta from '/client/lib/StepDelta';

class Action {
    constructor(obj) {
        obj = obj || {};

        this.strideType = obj.strideType || StrideType.SixToFive;
        this.stepType = obj.stepType || StepType.Full;
        this.direction = obj.direction || Direction.N;

        let delta = StepDelta.getDelta(this.strideType,
            this.stepType,
            this.direction);
        this.deltaX = obj.deltaX === undefined ? delta.deltaX : obj.deltaX;
        this.deltaY = obj.deltaY === undefined ? delta.deltaY : obj.deltaY;
    }
}

export default Action;
