import StepDelta from '/client/lib/StepDelta';
import StepType from '/client/lib/StepType';
import StrideType from '/client/lib/StrideType';

class StepFactory {
    static createStep(strideType, stepType, direction, deltaX, deltaY){
        var delta = StepDelta.getDelta(strideType, stepType, direction);
        var scriptNode = {
            strideType: strideType || StrideType.SixToFive,
            stepType: stepType || StepType.Full,
            direction: direction,
            deltaX: deltaX || delta.deltaX,
            deltaY: deltaY || delta.deltaY
        };
        return scriptNode;
    }
}

export default StepFactory;