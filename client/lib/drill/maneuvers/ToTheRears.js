import Direction from '/client/lib/Direction';
import MemberSequences from '../MemberSequences';
import ScriptSequence from '../ScriptSequence';
import Block from '../Block';

export default class ToTheRears {
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
    };
    // return an object keyed by member id, with script as value
    const scripts = {};

    // fileModifier inverts the file delay, if right-to-left
    const fileModifier =
      options.fileDelayDirection == 'left-to-right' ? 0 : this.files.length - 1;
    this.files.forEach((file, f) => {
      file.fileMembers.forEach((member, r) => {
        const script = new ScriptSequence();
        const rankModifier =
          options.rankDelayDirection == 'front-to-back'
            ? 0
            : file.fileMembers.length - 1;
        const count =
          // member.stepsToLeader * r +
          options.fileDelay * Math.abs(fileModifier - f) +
          options.rankDelay * Math.abs(rankModifier - r);
        script.addStep(
          {
            strideType: member.strideType,
            stepType: member.stepType,
            direction: Direction.rotate180(member.direction),
          },
          count
        );
        scripts[member.id] = script;
      });
    });

    return new MemberSequences(scripts);
  }
}
