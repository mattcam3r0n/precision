import MemberSequences from '../MemberSequences';
import ScriptSequence from '../ScriptSequence';
import Direction from '/client/lib/Direction';
import StepType from '/client/lib/StepType';
import Block from '../Block';

export default class Column {
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
    options = options || { turnDirection: 'right', fileDelay: 2 };
    // if turning right, start from leftmost file
    // if turning left, start from rightmost file
    // each member of file turns in turnDirection, but delayed by place in file
    // return an object keyed by member id, with script as value

    const scripts = {};
    const fileSpacing = options.fileDelay || 2;
    // process files right-to-left
    this.files.forEach((file, f) => {
      file.fileMembers.forEach((member, r) => {
        // get appropriate file index, depending on left-to-right or right-to-left
        const fIndex =
          ((options.turnDirection == 'left' && !options.reverse) || (options.turnDirection == 'right' && options.reverse))
            ? f
            : this.files.length - 1 - f;
            const turnCount = fIndex * fileSpacing + r * member.stepsToLeader;
        const turnDirection =
          options.turnDirection == 'left'
            ? Direction.leftOf(file.leader.direction)
            : Direction.rightOf(file.leader.direction);
        const script = new ScriptSequence();
        // second turn in turnDirection. for leader,
        script.addStep(
          {
            strideType: file.leader.strideType,
            stepType: StepType.Full,
            direction: turnDirection,
          },
          turnCount
        );
        scripts[member.id] = script;
      });
    });
    return new MemberSequences(scripts);
  }
}
