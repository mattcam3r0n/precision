export default class MemberSequences {

  constructor(sequences) {
    this.sequences = sequences || {};
  }

  add(member, sequence) {

  }

  get maxLength() {
    // get max length of sequences
    return Object.values(this.sequences).reduce((max, seq) => {
      return seq.length > max ? seq.length : max;
    }, 0);
  }
}
