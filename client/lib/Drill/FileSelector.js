import FileMember from './FileMember';
import File from './File';
import StepDelta from '/client/lib/StepDelta';
import StepType from '/client/lib/StepType';
import Direction from '/client/lib/Direction';
import MemberPositionCalculator from '/client/lib/drill/MemberPositionCalculator';
import PositionMap from './PositionMap';

// Unnecessary?
// let followingDirs = {
//   [Direction.N]: [Direction.N, Direction.E, Direction.W],
//   [Direction.E]: [Direction.E, Direction.S, Direction.N],
//   [Direction.S]: [Direction.S, Direction.E, Direction.W],
//   [Direction.W]: [Direction.W, Direction.S, Direction.N],
// };

let followedByDirs = {
  [Direction.N]: [Direction.S, Direction.E, Direction.W],
  [Direction.E]: [Direction.W, Direction.S, Direction.N],
  [Direction.S]: [Direction.N, Direction.E, Direction.W],
  [Direction.W]: [Direction.E, Direction.S, Direction.N],
};

class FileSelector {
  constructor(members, positionMap) {
    this.members = members;
    this.positionMap = positionMap || new PositionMap(members);
  }

  findFiles() {
    // try to find files by path
    const files = this.findFilesByPath();
    // if no files returned
    // try to find files by position
    if (files && files.length > 0) {
      return files;
    }
    return this.findFilesByPosition();
  }

  /**
   * Find files by examining the path that each member takes.  I.e, do they
   * follow in the footsteps of another member?
   *
   * @return {Array} files
   */
  findFilesByPath() {
    let fileMembers = {};

    const fileLeaders = [];
    // build a FileMember for each member, and keep a map of them
    this.members.forEach((m) => {
      let fm = new FileMember(m);
      fileMembers[m.id] = fm;
    });
    // for each member, find and wireup following/followedBy props
    this.members.forEach((m) => {
      let fm = fileMembers[m.id];
      let following = this.getFollowing(m);
      if (following) {
        fm.following = fileMembers[following.id];
        fm.following.followedBy = fm;
      } else {
        fileLeaders.push(fm);
      }
    });

    return fileLeaders.map((l) => new File(l));
  }

  /**
   * Find files by their position in the block. This is a naive algorithm that
   * will not detect files that are in the middle of turns, etc.
   * @param  {Direction} dir
   * @return {Array} files
   */
  findFilesByPosition(dir) {
    dir = dir == null ? this.getAverageDirection() : dir;
    /*
    get files depending on dir
      resort Xs and Ys depending on dir
      N = X asc,  Y asc
      E = X desc, Y asc
      S = X desc, Y desc
      W = X asc,  Y desc
    */
    const useFforX = (d) => d === Direction.N || d === Direction.S;
    const filesArray = this.getFileValues(dir).map((f) => {
      return this.getRankValues(dir)
        .map((r) => {
          // const x = f;
          // const y = r;
          const x = useFforX(dir) ? f : r;
          const y = useFforX(dir) ? r : f;
          console.log('f,r', f, r);
          //          console.log('getAt', x, y);
          return this.positionMap.getMemberAtPosition(x, y);
        })
        .filter((m) => m !== null);
    });
    // map double array of files into files structure
    return filesArray.map((f) => {
      return new File(f, dir);
    });
  }

  getFileValues(dir) {
    if (dir === Direction.N) {
      return this.positionMap.distinctXs;
    }
    if (dir === Direction.S) {
      return this.positionMap.distinctXs.reverse();
    }
    if (dir === Direction.E) {
      return this.positionMap.distinctYs;
    }
    if (dir === Direction.W) {
      return this.positionMap.distinctYs.reverse();
    }
    return this.positionMap.distinctXs;
  }

  getRankValues(dir) {
    if (dir === Direction.N) {
      return this.positionMap.distinctYs;
    }
    if (dir === Direction.S) {
      return this.positionMap.distinctYs.reverse();
    }
    if (dir === Direction.E) {
      return this.positionMap.distinctXs.reverse();
    }
    if (dir === Direction.W) {
      return this.positionMap.distinctXs;
    }
    return this.positionMap.distinctYs;
  }

  getAverageDirection() {
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

  getFollowing(m) {
    for (let i = 2; i <= 6; i += 2) {
      let pos = MemberPositionCalculator.stepForward(m, m.currentState, i);
      let following = this.positionMap.getMemberAtPosition(pos.x, pos.y);
      if (following) {
        return following;
      }
    }

    return null;
  }

  getFollowedBy(m) {
    let dirsToCheck = followedByDirs[m.currentState.direction];

    for (let i = 0; i < dirsToCheck.length; i++) {
      let dir = dirsToCheck[i];
      let pos = this.getRelativePosition(m.currentState, dir, 2);
      let followedBy = this.positionMap.getMemberAtPosition(pos.x, pos.y);

      // see if (potential) followedBy is following m
      if (followedBy && this.getFollowing(followedBy) == m) {
        return followedBy;
      }
    }

    return null;
  }

  // Get the position n (interval) steps in the given direction from position.
  getRelativePosition(position, dir, n) {
    let d = StepDelta.getDelta(position.strideType, StepType.Full, dir);
    return {
      x: position.x + d.deltaX * n,
      y: position.y + d.deltaY * n,
    };
  }
}

export default FileSelector;
