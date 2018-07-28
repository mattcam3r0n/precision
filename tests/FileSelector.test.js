// import { expect } from 'meteor/practicalmeteor:chai';
import { expect } from 'chai';

import Direction from '/client/lib/Direction';
import FileSelector from '../client/lib/drill/FileSelector';
import BlockBuilder from './BlockBuilder';

describe('FileSelector', function() {
  before(function() {});

  /*
    This configuration, facing E

    X X X
    X X X
  */
  const builder = new BlockBuilder();
  const members = builder.build({
    direction: 90,
    left: 220,
    top: 300,
    files: 3, // files/ranks don't respect direction in builder, yet
    ranks: 2,
  });

  describe('getAverageDirection', function() {
    it('should be E', function() {
      const fs = new FileSelector(members);
      const dir = fs.getAverageDirection();
      expect(dir).to.equal(Direction.E);
    });
  });

  describe('findFilesByPosition', function() {
    const fs = new FileSelector(members);

    describe('facing E', function() {
      const files = fs.findFilesByPosition();

      it('should find 2 files', function() {
        expect(files.length).to.equal(2);
      });

      it('each file should have 3 ranks', function() {
        files.forEach((f) => {
          expect(f.fileMembers.length).to.equal(3);
        });
      });

      it('each member should face E', function() {
        files.forEach((f) => {
          f.fileMembers.forEach((fm) => {
            expect(fm.direction).to.equal(Direction.E);
          });
        });
      });
    });

    describe('facing W', function() {
      const files = fs.findFilesByPosition(Direction.W);

      it('should find 2 files', function() {
        expect(files.length).to.equal(2);
      });

      it('each file should have 3 ranks', function() {
        files.forEach((f) => {
          expect(f.fileMembers.length).to.equal(3);
        });
      });

      it('each member should face W', function() {
        files.forEach((f) => {
          f.fileMembers.forEach((fm) => {
            expect(fm.direction).to.equal(Direction.W);
          });
        });
      });
    });

    describe('facing N', function() {
      const files = fs.findFilesByPosition(Direction.N);

      it('should find 3 files', function() {
        expect(files.length).to.equal(3);
      });

      it('each file should have 2 ranks', function() {
        files.forEach((f) => {
          expect(f.fileMembers.length).to.equal(2);
        });
      });

      it('each member should face N', function() {
        files.forEach((f) => {
          f.fileMembers.forEach((fm) => {
            expect(fm.direction).to.equal(Direction.N);
          });
        });
      });
    });

    describe('facing S', function() {
      const files = fs.findFilesByPosition(Direction.S);

      it('should find 3 files', function() {
        expect(files.length).to.equal(3);
      });

      it('each file should have 2 ranks', function() {
        files.forEach((f) => {
          expect(f.fileMembers.length).to.equal(2);
        });
      });

      it('each member should face S', function() {
        files.forEach((f) => {
          f.fileMembers.forEach((fm) => {
            expect(fm.direction).to.equal(Direction.S);
          });
        });
      });
    });
  });
});
