import Direction from '../Direction';

/*
    member position helper
    ------
    isBehind(m1, m2) - is m1 behind m2
    isAhead(m1, m2) - is m1 ahead of m2
    isLeftOf()
    isRightOf()
    sameFile(m1, m2)
    sameRank(m1, m2)
    isFollowing(m1, m2) - is m1 following m2
  */

export default class MemberPosition {
  constructor(member) {
    this.member = member;
  }

  isBehind(m2) {
    return Direction.isBehind(
      this.member.currentState,
      m2.currentState,
      this.member.currentState.direction
    );
  }
}
