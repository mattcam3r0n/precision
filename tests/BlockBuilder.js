import Direction from '/client/lib/Direction';

const defaultOptions = {
  files: 4,
  ranks: 4,
  direction: Direction.E,
  fileSpacing: 2,
  rankSpacing: 2,
  left: 0,
  top: 0,
};

export default class BlockBuilder {
  build(options = {}) {
    options = Object.assign(defaultOptions, options);

    const members = [];
    for (let f = 0; f < options.files; f++) {
      const x = options.left + (f * options.fileSpacing * 10);
      for (let r = 0; r < options.ranks; r++) {
        const y = options.top + (r * options.rankSpacing * 10);
        members.push(buildMember({
          id: r + (f * options.ranks),
          x: x,
          y: y,
          direction: options.direction,
        }));
      }
    }
    return members;
  }
}

function buildMember(options) {
  return {
    id: options.id,
    initialState: {
      x: options.x,
      y: options.y,
      direction: options.direction,
    },
    currentState: {
      x: options.x,
      y: options.y,
      direction: options.direction,
      count: 0,
    },
    script: [],
  };
}
