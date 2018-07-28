// import { expect } from 'meteor/practicalmeteor:chai';
import { expect } from 'chai';

import BlockBuilder from './BlockBuilder';

describe('BlockBuilder', function() {
  before(function() {});

  describe('build', function() {
    it('should be 3x3 block facing E', function() {
      const bb = new BlockBuilder();
      const block = bb.build({
        files: 3,
        ranks: 3,
        direction: 90,
      });
      expect(block.length).to.equal(9);
      block.forEach((m) => expect(m.currentState.direction).to.equal(90));
    });

    it('should be 3x4 block facing S', function() {
      const bb = new BlockBuilder();
      const block = bb.build({
        files: 3,
        ranks: 4,
        direction: 180,
      });
      expect(block.length).to.equal(12);
      block.forEach((m) => expect(m.currentState.direction).to.equal(180));
    });
  });
});
