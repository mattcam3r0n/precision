export default class MemberSequences {

  constructor(sequences) {
    this.sequences = sequences || {};
  }

  add(member, sequence) {

  }

  getSequence(memberId) {
    if (!this.sequences[memberId]) return [];
    return this.sequences[memberId].getSequence();
  }

  get maxLength() {
    // get max length of sequences
    return Object.values(this.sequences).reduce((max, seq) => {
      return seq.length > max ? seq.length : max;
    }, 0);
  }
}
