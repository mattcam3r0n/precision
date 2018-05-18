import MemberSequences from '../MemberSequences';
import ScriptSequence from '../ScriptSequence';
import Direction from '/client/lib/Direction';
import StepType from '/client/lib/StepType';
import Block from '../Block';

export default class Illinois {
  constructor(members) {
    // detect files
    this.block = new Block(members);
    this.files = this.block.getFiles();
    this.files = this.block.sortFilesLeftToRight(
      this.files,
      this.files[0].leader.direction
    );
    // sort files by leader, based on leader dir
    this.rankCount = this.files[0].length; // TODO: use max file length?
  }

  generate() {
    // return an object keyed by member id, with script as value
    const leftSide = this.generateLeftSide();
    const rightSide = this.generateRightSide();

    return new MemberSequences(Object.assign(leftSide, rightSide));
  }

  generateLeftSide() {
    const files = this.files.slice(0, this.files.length / 2); // get 1st half of files in block
    const interval = 2; // calc rank spacing of file
    const secondTurnCount = (this.rankCount - this.files.length / 2) * interval;
    const scripts = {};
    files.forEach((file, f) => {
      file.fileMembers.forEach((member, r) => {
        const c = (r - (files.length - f - 1)) * interval;
        const firstTurnCount = c < 0 ? 0 : c;
        // insert first and second turns
        const script = new ScriptSequence();
        if (firstTurnCount < secondTurnCount) {
          script.addStep(
            {
              strideType: file.leader.strideType,
              stepType: StepType.Full,
              direction: Direction.leftOf(file.leader.direction),
            },
            firstTurnCount
          );
        }
        // direction is leftOf(leader.direction)
        script.addStep(
          {
            strideType: file.leader.strideType,
            stepType: StepType.Full,
            direction: file.leader.direction,
          },
          secondTurnCount
        );
        scripts[member.id] = script;
      });
    });
    return scripts;
  }

  generateRightSide() {
    const files = this.files.slice(this.files.length / 2); // get 2nd half
    const interval = 2; // calc rank spacing of file
    const secondTurnCount = (this.rankCount - this.files.length / 2) * interval;
    const scripts = {};
    files.forEach((file, f) => {
      file.fileMembers.forEach((member, r) => {
        const c = (r - f) * interval;
        const firstTurnCount = c < 0 ? 0 : c;
        // insert first and second turns
        const script = new ScriptSequence();
        if (firstTurnCount < secondTurnCount) {
          script.addStep(
            {
              strideType: file.leader.strideType,
              stepType: StepType.Full,
              direction: Direction.rightOf(file.leader.direction),
            },
            firstTurnCount
          );
        }
        // direction is leftOf(leader.direction)
        script.addStep(
          {
            strideType: file.leader.strideType,
            stepType: StepType.Full,
            direction: file.leader.direction,
          },
          secondTurnCount
        );
        scripts[member.id] = script;
      });
    });
    return scripts;
  }
}
