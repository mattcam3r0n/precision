import PositionMap from './PositionMap';
import Direction from '/client/lib/Direction';
import FileSelector from './FileSelector';

export default class Block {
  constructor(members) {
    this.members = members;
    this.positionMap = new PositionMap(members);
    this.fileSelector = new FileSelector(members, this.positionMap);
    const files = this.fileSelector.findFiles();
    this.files = this.sortFilesLeftToRight(files, files[0].leader.direction);
  }

  get leftFile() {
    return this.files[0];
  }

  get rightFile() {
    return this.files[this.files.length - 1];
  }

  get leftFileLeader() {
    return this.leftFile.leader;
  }

  get rightFileLeader() {
    return this.rightFile.leader;
  }

  getFiles() {
    if (!this.files) {
      this.files = this.fileSelector.findFiles();
    }
    return this.files;
  }

  // determine whether the file leaders are in a straight rank
  areFileLeadersStraight() {
    const firstLeader = this.files[0].leader;
    const firstLeaderPos = {
      x: firstLeader.x,
      y: firstLeader.y,
    };
    // all leaders must be on same x/y plane, else false
    return this.files.reduce((areStraight, file) => {
      return (
        areStraight &&
        (firstLeaderPos.x == file.leader.x || firstLeaderPos.y == file.leader.y)
      );
    }, true);
  }

  sortFilesLeftToRight(files, direction) {
    sorted = files.slice();
    const sortFunc = directionSortFuncs[direction];
    sorted.sort(sortFunc);
    return sorted;
  }

  // TODO: use getAverageDirection in fileSelector?
  getBlockDirection() {
    // get mode of direction
    const modes = {};
    // count the # of members in each direction
    this.members.forEach((m) => {
      const dir = m.currentState.direction;
      if (!modes[dir]) {
        modes[dir] = 0;
      }
      modes[dir] = modes[dir] + 1;
    });

    // find the greatest number, assume that direction
    const dir = Object.keys(modes).reduce((max, k) => {
      return modes[k] > max ? k : max;
    }, 0);
    return Number(dir);
  }

  // getRankSpacing() {} // calculate spacing between ranks

  // getFileSpacing() {} // calc spacing between files

  // getRanks() {} // return array of arrays, each array being a rank (relative to block direction)

  // getFiles() {} // return array of arrays, each array being a file (relative to block direction)
}

const directionSortFuncs = {
  [Direction.E]: (a, b) => {
    if (a.leader.y < b.leader.y) {
      return -1;
    }
    if (a.leader.y > b.leader.y) {
      return 1;
    }
    return 0;
  },
  [Direction.W]: (a, b) => {
    if (a.leader.y > b.leader.y) {
      return -1;
    }
    if (a.leader.y < b.leader.y) {
      return 1;
    }
    return 0;
  },
  [Direction.N]: (a, b) => {
    if (a.leader.x < b.leader.x) {
      return -1;
    }
    if (a.leader.x > b.leader.x) {
      return 1;
    }
    return 0;
  },
  [Direction.S]: (a, b) => {
    if (a.leader.x > b.leader.x) {
      return -1;
    }
    if (a.leader.x < b.leader.x) {
      return 1;
    }
    return 0;
  },
};
