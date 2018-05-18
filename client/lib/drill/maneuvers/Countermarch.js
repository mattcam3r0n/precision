import ScriptSequence from '../ScriptSequence';
import Block from '../Block';

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
      turnDirection: 'left',
      fileDelay: 0,
      rankDelay: 0,
    };
    // return an object keyed by member id, with script as value
    const scripts = {};

    this.files.forEach((file, f) => {
      file.fileMembers.forEach((member, r) => {
        const script = new ScriptSequence();
        const count =
          member.stepsToLeader * r +
          options.fileDelay * f +
          options.rankDelay * r;
        script.addCountermarch(
          options.turnDirection,
          member.currentState,
          count
        );
        scripts[member.id] = script;
      });
    });

    return scripts;
  }
}
