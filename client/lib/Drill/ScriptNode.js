
class ScriptNode {
    constructor(stepType, stepCount, direction) {
        this.stepType = stepType;
        this.stepCount = 1; // always 1 for now
        this.direction = direction;

        this.deltaX = 0;
        this.deltaY = 0;
    }
}

export default ScriptNode;