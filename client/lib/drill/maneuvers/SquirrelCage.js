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
        clockwise
      );
    });
    // reverse script?
    // add 180 to each dir in script
    return scripts;
  }

  generateMemberSequence(currentState, corners, counts, clockwise = true) {
    const script = new ScriptSequence();
    for (let count = 0; count < counts; count++) {
      const action = this.getAction(currentState, corners);
      script.addStep(action);
      currentState = MemberPositionCalculator.doAction(currentState, action);
    }
    return clockwise ? script : script.reverse();
  }

  /**
   * Returns the appropriate action depending on the current position. Assumes
   * a clockwise rotation.
   * @param {Object} memberState
   * @param {Object} corners
   * @return {Object} action
   */
  getAction(memberState, corners) {
    if (this.isOnTopSide(memberState, corners)) {
      return new Action({
        direction: Direction.E,
        stepType: StepType.Full,
        strideType: memberState.strideType,
      });
    }
    if (this.isOnRightSide(memberState, corners)) {
      return new Action({
        direction: Direction.S,
        stepType: StepType.Full,
        strideType: memberState.strideType,
      });
    }
    if (this.isOnBottomSide(memberState, corners)) {
      return new Action({
        direction: Direction.W,
        stepType: StepType.Full,
        strideType: memberState.strideType,
      });
    }
    if (this.isOnLeftSide(memberState, corners)) {
      return new Action({
        direction: Direction.N,
        stepType: StepType.Full,
        strideType: memberState.strideType,
      });
    }
  }

  isOnTopSide(point, corners) {
    return point.y === corners.upperLeft.y && point.x < corners.upperRight.x;
  }

  isOnBottomSide(point, corners) {
    return point.y === corners.bottomLeft.y && point.x > corners.bottomLeft.x;
  }

  isOnRightSide(point, corners) {
    return point.x === corners.upperRight.x && point.y < corners.bottomRight.y;
  }

  isOnLeftSide(point, corners) {
    return point.x === corners.upperLeft.x && point.y > corners.upperLeft.y;
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
      canRotate: pm.distinctXs.length > 1 || pm.distinctYs.length > 1,
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
