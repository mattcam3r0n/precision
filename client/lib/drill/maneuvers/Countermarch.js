import MemberSequences from '../MemberSequences';
import ScriptSequence from '../ScriptSequence';
import Block from '../Block';
import StepType from '/client/lib/StepType';

export default class Countermarch {
  constructor(members) {
    // detect files
    this.block = new Block(members);
    this.files = this.block.getFiles();
    // sort files by leader, based on leader dir
    this.files = this.block.sortFilesLeftToRight(
      this.files,
      this.files[0].leader.direction // TODO: better way?
    );
  }

  generate(options) {
    options = options || {
      countermarchDirection: 'left',
      fileDelay: 0,
      fileDelayDirection: 'left-to-right',
      rankDelay: 0,
      stepType: StepType.Half,
    };
    // return an object keyed by member id, with script as value
    const scripts = {};

    // fileModifier inverts the file delay, if right-to-left
    const fileModifier =
      options.fileDelayDirection == 'left-to-right' ? 0 : this.files.length - 1;
    this.files.forEach((file, f) => {
      file.fileMembers.forEach((member, r) => {
        const script = new ScriptSequence();
        const count =
          member.stepsToLeader * r +
          options.fileDelay * Math.abs(fileModifier - f) +
          options.rankDelay * r;
        script.addCountermarch(
          options.countermarchDirection,
          file.leader.currentState,
          count,
          options.stepType
        );
        scripts[member.id] = script;
      });
    });

    return new MemberSequences(scripts);
  }
}
