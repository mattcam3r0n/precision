import PositionMap from './PositionMap';

export default class Block {
  constructor(members) {
    this.members = members;
    this.positionMap = new PositionMap(members);
  }

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

  getRankSpacing() {} // calculate spacing between ranks

  getFileSpacing() {} // calc spacing between files

  getRanks() {} // return array of arrays, each array being a rank (relative to block direction)

  getFiles() {} // return array of arrays, each array being a file (relative to block direction)
}
