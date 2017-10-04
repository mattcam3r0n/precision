import StepDelta from '/client/lib/StepDelta';

class StepFactory {
    static createStep(strideType, stepType, direction, deltaX, deltaY){
        var delta = StepDelta.getDelta(strideType, stepType, direction);
        var scriptNode = {
            strideType: strideType,
            stepType: stepType,
            direction: direction,
            stepCount: 1, // always 1 for now
            deltaX: deltaX || delta.deltaX,
            deltaY: deltaY || delta.deltaY
        };
        return scriptNode;
    }
}

export default StepFactory;