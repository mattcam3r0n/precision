import Direction from '/client/lib/Direction';
import Action from '/client/lib/drill/Action';
import StepType from '/client/lib/StepType';

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

  get length() {
    return this.sequence.length;
  }

  clone() {
    return new ScriptSequence(this.sequence);
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

  addNull(counts, at) {
    counts = counts || 1;
    if (at == null) {
      for (let i = 0; i < counts; i++) {
        this.sequence.push(null);
      }
    } else {
      for (let i = 0; i < counts; i++) {
        this.sequence[at + i] = null;
      }
    }
  }

  insertNull(counts, at) {
    at = at || 0;
    counts = counts || 0;
    for (let i = 0; i < counts; i++) {
      this.sequence.splice(at, 0, null);
    }
  }

  addUndefined(counts) {
    counts = counts || 1;
    for (let i = 0; i < counts; i++) {
      this.sequence.push(undefined);
    }
  }

  insertUndefined(counts, at) {
    at = at || 0;
    counts = counts || 0;
    for (let i = 0; i < counts; i++) {
      this.sequence.splice(at, 0, undefined);
    }
  }

  deleteCount(counts, at) {
    at = at || 0;
    counts = counts || 0;
    this.sequence.splice(at, counts);
  }

  /**
   * Add a step.
   * @param {Object} step The step (action) to add.
   * @param {Number} at The index at which to add.
   */
  addStep(step, at) {
    const action = new Action(step);
    if (at == null) {
      this.sequence.push(action);
    } else {
      this.sequence[at] = action;
    }
  }

  addCountermarch(leftOrRight, currentState, at, stepType = StepType.Half) {
    if (leftOrRight == 'left') {
      this.addLeftCountermarch(currentState, at, stepType);
    } else {
      this.addRightCountermarch(currentState, at, stepType);
    }
  }

  addLeftCountermarch(currentState, at, stepType = StepType.Half) {
    let firstTurnDirection = Direction.leftOf(currentState.direction);
    let secondTurnDirection = Direction.leftOf(firstTurnDirection);

    let firstTurn = new Action({
      strideType: currentState.strideType,
      stepType: stepType,
      direction: firstTurnDirection,
    });

    let secondTurn = new Action({
      strideType: currentState.strideType,
      stepType: StepType.Full,
      direction: secondTurnDirection,
    });

    this.addStep(firstTurn, at);
    this.addNull(1, at + 1);
    this.addStep(secondTurn, at + 2);
  }

  addRightCountermarch(currentState, at, stepType = StepType.Half) {
    let firstTurnDirection = Direction.rightOf(currentState.direction);
    let secondTurnDirection = Direction.rightOf(firstTurnDirection);

    let firstTurn = new Action({
      strideType: currentState.strideType,
      stepType: stepType,
      direction: firstTurnDirection,
    });

    let secondTurn = new Action({
      strideType: currentState.strideType,
      stepType: StepType.Full,
      direction: secondTurnDirection,
    });

    this.addStep(firstTurn, at);
    this.addNull(1, at + 1);
    this.addStep(secondTurn, at + 2);
  }

  addRightFace(count) {}

  addLeftFace(count) {}

  addAboutFace2(count) {}

  addAboutFace3(count) {}

  /** Returns a new sequence that is the reverse of the original.
   * @return {ScriptSequence} A new, reversed sequence.
   */
  reverse() {
    const reversed = this.sequence.slice().reverse();
    return new ScriptSequence(reversed);
  }

  reverseSequenceAndActions() {
    const reversed = this.sequence
      .slice()
      .reverse()
      .map((a) => new Action(a).reverse());
    return new ScriptSequence(reversed);
  }
}
