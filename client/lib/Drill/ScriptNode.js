import StepDelta from '/client/lib/StepDelta';

class ScriptNode {
    constructor(strideType, stepType, dir, dx, dy) {
        //this.stepCount = 1; // always 1 for now
        this.strideType = strideType;
        this.stepType = stepType;
        this.direction = dir;

        var delta = StepDelta.getDelta(strideType, stepType, dir);
        this.deltaX = dx || delta.deltaX;
        this.deltaY = dy || delta.deltaY;
    }
}

export default ScriptNode;