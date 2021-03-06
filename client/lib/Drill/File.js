import MemberPositionCalculator from './MemberPositionCalculator';
import FileMember from './FileMember';

class File {
  constructor(leadMemberOrArray, overrideDirection) {
    if (Array.isArray(leadMemberOrArray)) {
      this.initFromArray(leadMemberOrArray, overrideDirection);
    } else {
      this.initFromLeadMember(leadMemberOrArray, overrideDirection);
    }
    this.leader.overrideDirection = overrideDirection;
  }

  initFromLeadMember(leadMember, overrideDirection) {
    this.leader = leadMember;
    this.leader.overrideDirection =
      overrideDirection != null ? overrideDirection : null;
    this.fileMembers = [leadMember];
    this.initMembers(leadMember, overrideDirection);
  }

  initMembers(leader, overrideDirection) {
    let m = leader.followedBy;
    while (m) {
      m.overrideDirection =
        overrideDirection != null ? overrideDirection : null;
      this.fileMembers.push(m);
      m = m.followedBy;
    }
  }

  initFromArray(members, overrideDirection) {
    let prev = null;
    const file = members.map((m, i) => {
      const fm = new FileMember(m);
      fm.following = prev;
      fm.overrideDirection =
        overrideDirection != null ? overrideDirection : null;
      if (prev) {
        prev.followedBy = fm;
      }
      prev = fm;
      return fm;
    });
    this.leader = file[0];
    this.fileMembers = file;
  }

  getReversedFile() {
    const reversed = [];
    this.fileMembers.forEach((fm, i) => {
      const newFm = new FileMember(fm.member);
      newFm.following = this.fileMembers[i + 1];
      newFm.stepsToLeader = this.fileMembers[i + 1]
        ? this.fileMembers[i + 1].stepsToLeader
        : 0;
      reversed.unshift(newFm);
    });
    return reversed; // new File(reversed[reversed.length - 1]);
  }

  get length() {
    return this.fileMembers.length;
  }

  addStep(step) {
    let lastStep = step;
    this.fileMembers.forEach((m) => {
      lastStep = m.addStep(lastStep);
    });
  }

  getLinePoints() {
    // return this.fileMembers.map(fm => {
    //     return {
    //         x: fm.member.currentState.x,
    //         y: fm.member.currentState.y
    //     };
    // });

    let points = [];
    for (let i = this.fileMembers.length - 1; i > 0; i--) {
      let fm = this.fileMembers[i];
      let pos = fm.member.currentState;
      let leaderPos = fm.following.member.currentState;
      let retries = 0;
      while (
        !MemberPositionCalculator.arePositionsSame(pos, leaderPos) &&
        retries < 8
      ) {
        let p = { x: pos.x, y: pos.y };
        points.unshift(p);
        pos = MemberPositionCalculator.stepForward(fm.member, pos, 1);
        retries++;
      }
    }
    points.unshift({
      x: this.leader.member.currentState.x,
      y: this.leader.member.currentState.y,
    });

    return points;
  }
}

export default File;
