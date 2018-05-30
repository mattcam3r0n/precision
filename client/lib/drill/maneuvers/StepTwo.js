// import Direction from '/client/lib/Direction';
import StepType from '/client/lib/StepType';
import MemberSequences from '../MemberSequences';
import ScriptSequence from '../ScriptSequence';
import Block from '../Block';

export default class StepTwo {
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
      initialState: 'halt',
      fileDelay: 0,
      fileDelayDirection: 'left-to-right',
      rankDelay: 0,
      rankDelayDirection: 'front-to-back',
    };
    // return an object keyed by member id, with script as value
    const scripts = {};

    const initialStepType =
      options.initialState == 'halt' ? StepType.Halt : StepType.MarkTime;
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
            stepType: initialStepType,
            direction: member.direction,
          },
          0
        );
        script.addStep(
          {
            strideType: member.strideType,
            stepType: member.stepType,
            direction: member.direction,
          },
          count
        );
        scripts[member.id] = script;
      });
    });

    return new MemberSequences(scripts);
  }
}
