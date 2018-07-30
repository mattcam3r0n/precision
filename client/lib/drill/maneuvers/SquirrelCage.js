import MemberSequences from '../MemberSequences';
import ScriptSequence from '../ScriptSequence';
import Direction from '/client/lib/Direction';
import StepType from '/client/lib/StepType';
import Block from '../Block';
import PositionMap from '/client/lib/drill/PositionMap';
import MemberPositionCalculator from '../MemberPositionCalculator';
import Action from '../Action';

export default class SquirrelCage {
  constructor(members) {
    this.members = members;
    // detect files
    this.block = new Block(members);
    this.files = this.block.getFiles();
    this.files = this.block.sortFilesLeftToRight(
      this.files,
      this.files[0].leader.direction
    );
  }

  generate(
    options = {
      clockwise: true,
      alternateRingDirection: false,
    }
  ) {
    // get rings
    const rings = this.getRings(this.members);
    const scripts = {};
    // generate sequences for each member in each ring
    rings.forEach((ring, i) => {
      const shouldRotateClockwise =
        options.alternateRingDirection && i % 2 > 0
          ? !options.clockwise
          : options.clockwise;
      const ringScripts = this.generateRingSequences(
        ring,
        shouldRotateClockwise,
        options.counts
      );
      Object.assign(scripts, ringScripts);
    });
    return new MemberSequences(scripts);
  }

  generateRingSequences(ring, clockwise, counts) {
    const scripts = {};
    ring.members.forEach((member) => {
      scripts[member.id] = this.generateMemberSequence(
        member.currentState,
        ring.corners,
        counts,
        clockwise,
        ring.canRotate
      );
    });
    return scripts;
  }

  generateMemberSequence(
    currentState,
    corners,
    counts,
    clockwise = true,
    canRotate = true
  ) {
    const script = new ScriptSequence();
    for (let count = 0; count < counts; count++) {
      const action = this.getAction(
        currentState,
        corners,
        clockwise,
        canRotate
      );
      script.addStep(action);
      currentState = MemberPositionCalculator.doAction(currentState, action);
    }
    return script;
  }

  /**
   * Returns the appropriate action depending on the current position. Assumes
   * a clockwise rotation.
   * @param {Object} memberState
   * @param {Object} corners
   * @param {boolean} clockwise
   * @param {boolean} canRotate
   * @return {Object} action
   */
  getAction(memberState, corners, clockwise = true, canRotate = true) {
    if (!canRotate) {
      return new Action({
        direction: memberState.direction,
        stepType: StepType.MarkTime,
        strideType: memberState.strideType,
      });
    }
    if (this.isOnTopSide(memberState, corners, clockwise)) {
      return new Action({
        direction: clockwise ? Direction.E : Direction.W,
        stepType: StepType.Full,
        strideType: memberState.strideType,
      });
    }
    if (this.isOnRightSide(memberState, corners, clockwise)) {
      return new Action({
        direction: clockwise ? Direction.S : Direction.N,
        stepType: StepType.Full,
        strideType: memberState.strideType,
      });
    }
    if (this.isOnBottomSide(memberState, corners, clockwise)) {
      return new Action({
        direction: clockwise ? Direction.W : Direction.E,
        stepType: StepType.Full,
        strideType: memberState.strideType,
      });
    }
    if (this.isOnLeftSide(memberState, corners, clockwise)) {
      return new Action({
        direction: clockwise ? Direction.N : Direction.S,
        stepType: StepType.Full,
        strideType: memberState.strideType,
      });
    }
  }

  isOnTopSide(point, corners, clockwise = true) {
    return (
      point.y === corners.upperLeft.y &&
      (clockwise
        ? point.x < corners.upperRight.x
        : point.x > corners.upperLeft.x)
    );
  }

  isOnBottomSide(point, corners, clockwise = true) {
    return (
      point.y === corners.bottomLeft.y &&
      (clockwise
        ? point.x > corners.bottomLeft.x
        : point.x < corners.bottomRight.x)
    );
  }

  isOnRightSide(point, corners, clockwise = true) {
    return (
      point.x === corners.upperRight.x &&
      (clockwise
        ? point.y < corners.bottomRight.y
        : point.y > corners.upperRight.y)
    );
  }

  isOnLeftSide(point, corners, clockwise = true) {
    return (
      point.x === corners.upperLeft.x &&
      (clockwise
        ? point.y > corners.upperLeft.y
        : point.y < corners.bottomLeft.y)
    );
  }

  getRings(members) {
    const outer = this.getOuterRing(members);
    const innerMembers = members.filter((m) => !outer.members.includes(m));
    if (innerMembers.length > 0) {
      const innerRings = this.getRings(innerMembers);
      return [outer, ...innerRings];
    } else {
      return [outer];
    }
  }

  getOuterRing(members) {
    const pm = new PositionMap(members);
    const corners = {
      upperLeft: pm.getUpperLeft(),
      upperRight: pm.getUpperRight(),
      bottomLeft: pm.getBottomLeft(),
      bottomRight: pm.getBottomRight(),
    };
    return {
      corners,
      canRotate: pm.distinctXs.length > 1 && pm.distinctYs.length > 1,
      members: members.filter((m) => {
        const { x, y } = m.currentState;
        return (
          (x >= corners.upperLeft.x &&
            x <= corners.upperRight.x &&
            (y === corners.upperLeft.y || y === corners.bottomLeft.y)) ||
          (y >= corners.upperLeft.y &&
            y <= corners.bottomLeft.y &&
            (x === corners.upperLeft.x || x === corners.upperRight.x))
        );
      }),
    };
  }
}
