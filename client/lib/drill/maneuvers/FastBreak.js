import MemberSequences from '../MemberSequences';
import ScriptSequence from '../ScriptSequence';
import Direction from '/client/lib/Direction';
import StepType from '/client/lib/StepType';
import Block from '../Block';

export default class FastBreak {
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
      fileDelayDirection: 'left-to-right',
    }
  ) {
    const scripts = {};
    // process files right-to-left
    this.files.forEach((file, f) => {
      // get appropriate file index, depending on left-to-right or right-to-left
      const fIndex =
        options.fileDelayDirection == 'left-to-right'
          ? f
          : this.files.length - 1 - f;
      file.fileMembers.forEach((member, r) => {
        const fileGroup = fIndex % 3;
        let script = null;
        switch (fileGroup) {
          case 0: // a
            script = aSequence(file.leader);
            break;
          case 1: // b
            script = bSequence(file.leader);
            break;
          case 2: // c
            script = cSequence(file.leader);
            break;
          default:
            break;
        }
        scripts[member.id] = script;
      }); // foreach filemember
    }); // foreach file
    return new MemberSequences(scripts);
  }
}

function aSequence(leader) {
  const script = new ScriptSequence();
  script.addStep({
    strideType: leader.strideType,
    stepType: StepType.Full,
    direction: leader.direction,
  });
  return script;
}

function bSequence(leader) {
  const script = new ScriptSequence();
  script.addStep({
    strideType: leader.strideType,
    stepType: StepType.MarkTime,
    direction: leader.direction,
  });
  script.addStep(
    {
      strideType: leader.strideType,
      stepType: StepType.Full,
      direction: leader.direction,
    },
    2
  );
  return script;
}

function cSequence(leader) {
  const script = new ScriptSequence();
  script.addStep({
    strideType: leader.strideType,
    stepType: StepType.Full,
    direction: Direction.rotate180(leader.direction),
  });
  script.addStep(
    {
      strideType: leader.strideType,
      stepType: StepType.Full,
      direction: leader.direction,
    },
    2
  );
  return script;
}
