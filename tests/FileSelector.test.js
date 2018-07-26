// import { expect } from 'meteor/practicalmeteor:chai';
import { expect } from 'chai';

import Direction from '/client/lib/Direction';
import FileSelector from '../client/lib/drill/FileSelector';

describe('FileSelector', function() {
  before(function() {});

  /*
    This configuration, facing E

    X X X
    X X X

  */
  const members = [
    {
      id: 1,
      initialState: {
        x: 220,
        y: 300,
        direction: 90,
      },
      currentState: {
        x: 220,
        y: 300,
        direction: 90,
        count: 0,
      },
      script: [],
    },
    {
      id: 2,
      initialState: {
        x: 240,
        y: 300,
        direction: 90,
      },
      currentState: {
        x: 240,
        y: 300,
        direction: 90,
        count: 0,
      },
      script: [],
    },
    {
      id: 3,
      initialState: {
        x: 260,
        y: 300,
        direction: 90,
      },
      currentState: {
        x: 260,
        y: 300,
        direction: 90,
        count: 0,
      },
      script: [],
    },
    {
      id: 4,
      initialState: {
        x: 220,
        y: 320,
        direction: 90,
      },
      currentState: {
        x: 220,
        y: 320,
        direction: 90,
        count: 0,
      },
      script: [],
    },
    {
      id: 5,
      initialState: {
        x: 240,
        y: 320,
        direction: 90,
      },
      currentState: {
        x: 240,
        y: 320,
        direction: 90,
        count: 0,
      },
      script: [],
    },
    {
      id: 6,
      initialState: {
        x: 260,
        y: 320,
        direction: 90,
      },
      currentState: {
        x: 260,
        y: 320,
        direction: 90,
        count: 0,
      },
      script: [],
    },
  ];

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
