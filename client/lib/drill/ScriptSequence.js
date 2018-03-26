import Direction from '/client/lib/Direction';
import Action from '/client/lib/drill/Action';

export default class ScriptSequence {
    constructor(sequence) {
        this.sequence = sequence ? sequence.slice() : [];
    }

    /**
     * Return the sequence
     *
     * @return {Array}
    */
    getSequence() {
        return this.sequence;
    }

    /**
     * Add a sequence of steps.
     * @param {Array} sequence The sequence of actions to add.
     * @param {Number} count The count at which the step will be added. If undefined, adds at end of sequence
     */
    addSequence(sequence, count) {
        this.sequence.splice(count - 1, sequence.length, ...sequence);
    }

    insertSequence(sequence, count) {
        this.sequence.splice(count - 1, 0, ...sequence);
    }

    addNull() {
        this.sequence.push(null);
    }

    /**
     * Add a step.
     * @param {Object} step The step (action) to add.
     */
    addStep(step) {
        const action = new Action(step);
        this.sequence.push(action);
    }

    addLeftCountermarch(currentState) {
        let firstTurnDirection = Direction.leftOf(currentState.direction);
        let secondTurnDirection = Direction
            .leftOf(firstTurnDirection);

        let firstTurn = new Action({
            strideType: currentState.strideType,
            stepType: StepType.Half,
            direction: firstTurnDirection,
        });

        let secondTurn = new Action({
            strideType: currentState.strideType,
            stepType: StepType.Full,
            direction: secondTurnDirection,
        });

        this.addStep(firstTurn);
        this.addNull();
        this.addStep(secondTurn);
    }

    addRightCountermarch(currentDir) {
        let firstTurnDirection = Direction.rightOf(currentState.direction);
        let secondTurnDirection = Direction
            .rightOf(firstTurnDirection);

        let firstTurn = new Action({
            strideType: currentState.strideType,
            stepType: StepType.Half,
            direction: firstTurnDirection,
        });

        let secondTurn = new Action({
            strideType: currentState.strideType,
            stepType: StepType.Full,
            direction: secondTurnDirection,
        });

        this.addStep(firstTurn);
        this.addNull();
        this.addStep(secondTurn);
    }

    addRightFace(count) {

    }

    addLeftFace(count) {

    }

    addAboutFace2(count) {

    }

    addAboutFace3(count) {

    }
}
