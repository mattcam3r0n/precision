import MemberSequences from '../MemberSequences';
import ScriptSequence from '../ScriptSequence';
import Direction from '/client/lib/Direction';
import StepType from '/client/lib/StepType';
import Block from '../Block';

export default class TexasTurn {
  constructor(members) {
    // detect files
    this.block = new Block(members);
    this.files = this.block.getFiles();
    this.files = this.block.sortFilesLeftToRight(
      this.files,
      this.files[0].leader.direction
    );
    this.reversedFiles = this.files.map((f) => f.getReversedFile());
  }

  generate(options) {
    options = options || { turnDirection: 'right' };
    // get the reverse of each file (last follower becomes leader)
    // if turning right, start from leftmost file
    // if turning left, start from rightmost file
    // each member of file turns in turnDirection, but delayed by place in file
    // each file is delayed by 2 (rank spacing)

    // return an object keyed by member id, with script as value
    if (options.turnDirection == 'right') {
      return this.generateRightTurn();
    } else {
      return this.generateLeftTurn();
    }
  }

  generateRightTurn() {
    const scripts = {};
    const fileSpacing = 2;
    // process files left-to-right
    this.reversedFiles.forEach((file, f) => {
      file.forEach((member, r) => {
        const firstTurnCount = f * fileSpacing;
        const secondTurnCount = r * member.stepsToLeader + f * fileSpacing;
        const script = new ScriptSequence();

        // first step is to-the-rear
        script.addStep(
          {
            strideType: file[0].strideType,
            stepType: StepType.Full,
            direction: Direction.rotate180(file[0].direction),
          },
          firstTurnCount
        );
        // second turn in turnDirection. for leader,
        script.addStep(
          {
            strideType: file[0].strideType,
            stepType: StepType.Full,
            direction: Direction.leftOf(Direction.rotate180(file[0].direction)),
          },
          secondTurnCount
        );
        scripts[member.id] = script;
      });
    });
    return new MemberSequences(scripts);
  }

  generateLeftTurn() {
    const scripts = {};
    const fileSpacing = 2;
    // process files right-to-left
    this.reversedFiles.forEach((file, f) => {
      file.forEach((member, r) => {
        // get modified index to go in right-to-left
        const fIndex = (this.reversedFiles.length - 1 - f);
        const firstTurnCount =
          fIndex * fileSpacing;
        const secondTurnCount = r * member.stepsToLeader + fIndex * fileSpacing;
        const script = new ScriptSequence();
        // first step is to-the-rear
        script.addStep(
          {
            strideType: file[0].strideType,
            stepType: StepType.Full,
            direction: Direction.rotate180(file[0].direction),
          },
          firstTurnCount
        );
        // second turn in turnDirection. for leader,
        script.addStep(
          {
            strideType: file[0].strideType,
            stepType: StepType.Full,
            direction: Direction.rightOf(
              Direction.rotate180(file[0].direction)
            ),
          },
          secondTurnCount
        );
        scripts[member.id] = script;
      });
    });
    return new MemberSequences(scripts);
  }
}
