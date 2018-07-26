import MemberSequences from '../MemberSequences';
import ScriptSequence from '../ScriptSequence';
import Direction from '/client/lib/Direction';
import StepType from '/client/lib/StepType';
import Block from '../Block';

export default class Waterfall {
  constructor(members) {
    // detect files
    this.block = new Block(members);
    this.files = this.block.getFiles();
    this.files = this.block.sortFilesLeftToRight(
      this.files,
      this.files[0].leader.direction
    );
    // this.rankCount = this.files[0].length; // TODO: use max file length?
  }

  generate(options) {
    options = options || { turnDirection: 'right', fileDelay: 6, depth: 6, repeat: 1 };
    // if turning right, start from leftmost file
    // if turning left, start from rightmost file
    // each member of file turns in turnDirection, but delayed by place in file
    // return an object keyed by member id, with script as value

    const scripts = {};
    const fileDelay = options.fileDelay || 6;
    const depth = options.depth || 6;
    // process files right-to-left
    this.files.forEach((file, f) => {
      // get appropriate file index, depending on left-to-right or right-to-left
      const fIndex =
        (options.turnDirection == 'left' && !options.reverse) ||
        (options.turnDirection == 'right' && options.reverse)
          ? f
          : this.files.length - 1 - f;
      file.fileMembers.forEach((member, r) => {
        const script = new ScriptSequence();
        // if the band is in a static state, add a first step in direction of file leader
        if (StepType.isStatic(member.stepType)) {
          script.addStep({
            strideType: file.leader.strideType,
            stepType: StepType.Full,
            direction: file.leader.direction,
          });
        }
        // repeat N times based on options.repeat
        for (let iteration = 0; iteration < options.repeat; iteration++) {
          const firstTurnCount =
            (iteration * (fileDelay + depth)) +
            (fIndex * fileDelay + r * member.stepsToLeader);
          const firstTurnDirection =
            options.turnDirection == 'left'
              ? Direction.leftOf(file.leader.direction)
              : Direction.rightOf(file.leader.direction);
          const secondTurnCount =
            (firstTurnCount + depth);
          const secondTurnDirection = file.leader.direction;
          // first turn
          script.addStep(
            {
              strideType: file.leader.strideType,
              stepType: StepType.Full,
              direction: firstTurnDirection,
            },
            firstTurnCount
          );
          // second turn
          script.addStep(
            {
              strideType: file.leader.strideType,
              stepType: StepType.Full,
              direction: secondTurnDirection,
            },
            secondTurnCount
          );
        } // end repeat
        scripts[member.id] = script;
      }); // foreach filemember
    }); // foreach file
    return new MemberSequences(scripts);
  }
}
