// import { expect } from 'meteor/practicalmeteor:chai';
import { expect } from 'chai';

import Direction from '/client/lib/Direction';
import BlockBuilder from './BlockBuilder';
import SquirrelCage from '/client/lib/drill/maneuvers/SquirrelCage';

describe('SquirrelCage', function() {
  before(function() {});

  const bb = new BlockBuilder();

  describe('4x4 block', function() {
    const block = bb.build({
      files: 4,
      ranks: 4,
      direction: 90,
    });
    const cage = new SquirrelCage(block);
    describe('getOuterRing', function() {
      const outerRing = cage.getOuterRing(block);

      it('should detect outer corner members', function() {
        const ul = outerRing.members.find(
          (m) => m.currentState.x === 0 && m.currentState.y === 0
        );
        const ur = outerRing.members.find(
          (m) => m.currentState.x === 60 && m.currentState.y === 0
        );
        const bl = outerRing.members.find(
          (m) => m.currentState.x === 0 && m.currentState.y === 60
        );
        const br = outerRing.members.find(
          (m) => m.currentState.x === 60 && m.currentState.y === 60
        );
        expect(ul).to.not.be.undefined;
        expect(ur).to.not.be.undefined;
        expect(bl).to.not.be.undefined;
        expect(br).to.not.be.undefined;
      });
      it('should detect outer non-corner members', function() {
        const x20y0 = outerRing.members.find(
          (m) => m.currentState.x === 20 && m.currentState.y === 0
        );
        const x20y60 = outerRing.members.find(
          (m) => m.currentState.x === 20 && m.currentState.y === 60
        );
        expect(x20y0).to.not.be.undefined;
        expect(x20y60).to.not.be.undefined;
      });
      it('should NOT detect inner members', function() {
        // the following should NOT be found
        const x20y20 = outerRing.members.find(
          (m) => m.currentState.x === 20 && m.currentState.y === 20
        );
        const x40y40 = outerRing.members.find(
          (m) => m.currentState.x === 40 && m.currentState.y === 40
        );
        expect(x20y20).to.be.undefined; // should NOT find this member in ring
        expect(x40y40).to.be.undefined; // should NOT find this member in ring
      });
    });

    describe('getRings', function() {
      const rings = cage.getRings(block);
      it('should detect 2 rings', function() {
        expect(rings.length).to.equal(2);
      });
      it('there should be 12 members in outer ring', function() {
        expect(rings[0].members.length).to.equal(12);
      });
      it('there should be 4 members in inner ring', function() {
        expect(rings[1].members.length).to.equal(4);
      });
      it('should be true for outer ring', function() {
        expect(rings[0].canRotate).to.be.true;
      });
      it('should be true for inner ring', function() {
        expect(rings[1].canRotate).to.be.true;
      });
    });

    describe('isOnSide Tests', function() {
      const corners = {
        upperLeft: { x: 0, y: 0 },
        upperRight: { x: 60, y: 0 },
        bottomLeft: { x: 0, y: 60 },
        bottomRight: { x: 60, y: 60 },
      };

      describe('isOnTopSide', function() {
        it('0,0 is on top side', function() {
          const point = { x: 0, y: 0 };
          expect(cage.isOnTopSide(point, corners)).to.be.true;
        });
        it('20,0 is on top side', function() {
          const point = { x: 20, y: 0 };
          expect(cage.isOnTopSide(point, corners)).to.be.true;
        });
        it('60,0 is NOT on top side', function() {
          const point = { x: 60, y: 0 };
          expect(cage.isOnTopSide(point, corners)).to.be.false;
        });
      });

      describe('isOnRightSide', function() {
        it('60,0 is on right side', function() {
          const point = { x: 60, y: 0 };
          expect(cage.isOnRightSide(point, corners)).to.be.true;
        });
        it('60,20 is on right side', function() {
          const point = { x: 60, y: 20 };
          expect(cage.isOnRightSide(point, corners)).to.be.true;
        });
        it('60,60 is NOT on right side', function() {
          const point = { x: 60, y: 60 };
          expect(cage.isOnRightSide(point, corners)).to.be.false;
        });
      });

      describe('isOnBottomSide', function() {
        it('60,60 is on Bottom side', function() {
          const point = { x: 60, y: 60 };
          expect(cage.isOnBottomSide(point, corners)).to.be.true;
        });
        it('40,60 is on Bottom side', function() {
          const point = { x: 40, y: 60 };
          expect(cage.isOnBottomSide(point, corners)).to.be.true;
        });
        it('0,60 is NOT on Bottom side', function() {
          const point = { x: 0, y: 60 };
          expect(cage.isOnBottomSide(point, corners)).to.be.false;
        });
      });

      describe('isOnLeftSide', function() {
        it('0,60 is on Left side', function() {
          const point = { x: 0, y: 60 };
          expect(cage.isOnLeftSide(point, corners)).to.be.true;
        });
        it('0,40 is on Left side', function() {
          const point = { x: 0, y: 40 };
          expect(cage.isOnLeftSide(point, corners)).to.be.true;
        });
        it('0,0 is NOT on Left side', function() {
          const point = { x: 0, y: 0 };
          expect(cage.isOnLeftSide(point, corners)).to.be.false;
        });
      });
    });

    describe('getAction', function() {
      // TODO: add test for canRotate false / MT
      const corners = {
        upperLeft: { x: 0, y: 0 },
        upperRight: { x: 60, y: 0 },
        bottomLeft: { x: 0, y: 60 },
        bottomRight: { x: 60, y: 60 },
      };

      it('should return E when on top side', function() {
        const action = cage.getAction({ x: 20, y: 0 }, corners);
        expect(action.direction).to.equal(Direction.E);
      });
      it('should return S when on right side', function() {
        const action = cage.getAction({ x: 60, y: 20 }, corners);
        expect(action.direction).to.equal(Direction.S);
      });
      it('should return W when on bottom side', function() {
        const action = cage.getAction({ x: 20, y: 60 }, corners);
        expect(action.direction).to.equal(Direction.W);
      });
      it('should return N when on left side', function() {
        const action = cage.getAction({ x: 0, y: 40 }, corners);
        expect(action.direction).to.equal(Direction.N);
      });
    });

    describe('generateMemberSequence', function() {
      const corners = {
        upperLeft: { x: 0, y: 0 },
        upperRight: { x: 60, y: 0 },
        bottomLeft: { x: 0, y: 60 },
        bottomRight: { x: 60, y: 60 },
      };

      describe('starting from UpperLeft corner, it should move 24 counts CLOCKWISE around the ring', function() {
        const currentState = {
          x: 0,
          y: 0,
        };
        const seq = cage.generateMemberSequence(currentState, corners, 24);
        it('should have 24 counts', function() {
          expect(seq.length).to.equal(24);
        });
        it('first 6 counts should be E', function() {
          seq.sequence.slice(0, 5).forEach((action) => {
            expect(action.direction).to.equal(Direction.E);
          });
        });
        it('next 6 counts should be S', function() {
          seq.sequence.slice(6, 11).forEach((action) => {
            expect(action.direction).to.equal(Direction.S);
          });
        });
        it('next 6 counts should be W', function() {
          seq.sequence.slice(12, 17).forEach((action) => {
            expect(action.direction).to.equal(Direction.W);
          });
        });
        it('next 6 counts should be N', function() {
          seq.sequence.slice(18, 23).forEach((action) => {
            expect(action.direction).to.equal(Direction.N);
          });
        });
      });

      describe('starting from UpperLeft corner, it should move 24 counts COUNTER-CLOCKWISE around the ring', function() {
        const currentState = {
          x: 0,
          y: 0,
        };
        const seq = cage.generateMemberSequence(
          currentState,
          corners,
          24,
          false
        );
    console.log(seq);
        it('should have 24 counts', function() {
          expect(seq.length).to.equal(24);
        });
        it('first 6 counts should be S', function() {
          seq.sequence.slice(0, 5).forEach((action) => {
            expect(action.direction).to.equal(Direction.S);
          });
        });
        it('next 6 counts should be E', function() {
          seq.sequence.slice(6, 11).forEach((action) => {
            expect(action.direction).to.equal(Direction.E);
          });
        });
        it('next 6 counts should be N', function() {
          seq.sequence.slice(12, 17).forEach((action) => {
            expect(action.direction).to.equal(Direction.N);
          });
        });
        it('next 6 counts should be W', function() {
          seq.sequence.slice(18, 23).forEach((action) => {
            expect(action.direction).to.equal(Direction.W);
          });
        });
      });

      describe('starting from 20, 0 on TopSide, it should move 24 counts around the ring', function() {
        const currentState = {
          x: 20,
          y: 0,
        };
        const seq = cage.generateMemberSequence(currentState, corners, 24);
        it('should have 24 counts', function() {
          expect(seq.length).to.equal(24);
        });
        it('first 4 counts should be E', function() {
          seq.sequence.slice(0, 3).forEach((action) => {
            expect(action.direction).to.equal(Direction.E);
          });
        });
        it('next 6 counts should be S', function() {
          seq.sequence.slice(4, 9).forEach((action) => {
            expect(action.direction).to.equal(Direction.S);
          });
        });
        it('next 6 counts should be W', function() {
          seq.sequence.slice(10, 15).forEach((action) => {
            expect(action.direction).to.equal(Direction.W);
          });
        });
        it('next 6 counts should be N', function() {
          seq.sequence.slice(16, 21).forEach((action) => {
            expect(action.direction).to.equal(Direction.N);
          });
        });
        it('next 2 counts should be E', function() {
          seq.sequence.slice(22, 23).forEach((action) => {
            expect(action.direction).to.equal(Direction.E);
          });
        });
      });
    });
  });

  describe('3x3 block', function() {
    const block = bb.build({
      files: 3,
      ranks: 3,
      direction: 90,
    });
    const cage = new SquirrelCage(block);
    describe('getOuterRing', function() {
      const outerRing = cage.getOuterRing(block);

      it('should detect outer corner members', function() {
        const ul = outerRing.members.find(
          (m) => m.currentState.x === 0 && m.currentState.y === 0
        );
        const ur = outerRing.members.find(
          (m) => m.currentState.x === 40 && m.currentState.y === 0
        );
        const bl = outerRing.members.find(
          (m) => m.currentState.x === 0 && m.currentState.y === 40
        );
        const br = outerRing.members.find(
          (m) => m.currentState.x === 40 && m.currentState.y === 40
        );
        expect(ul).to.not.be.undefined;
        expect(ur).to.not.be.undefined;
        expect(bl).to.not.be.undefined;
        expect(br).to.not.be.undefined;
      });
      it('should detect outer non-corner members', function() {
        const x20y0 = outerRing.members.find(
          (m) => m.currentState.x === 20 && m.currentState.y === 0
        );
        const x20y40 = outerRing.members.find(
          (m) => m.currentState.x === 20 && m.currentState.y === 40
        );
        expect(x20y0).to.not.be.undefined;
        expect(x20y40).to.not.be.undefined;
      });
      it('should NOT detect inner members', function() {
        // the following should NOT be found
        const x20y20 = outerRing.members.find(
          (m) => m.currentState.x === 20 && m.currentState.y === 20
        );
        expect(x20y20).to.be.undefined; // should NOT find this member in ring
      });
    });

    describe('getRings', function() {
      const rings = cage.getRings(block);
      it('should detect 2 rings', function() {
        expect(rings.length).to.equal(2);
      });
      it('there should be 8 members in outer ring', function() {
        expect(rings[0].members.length).to.equal(8);
      });
      it('there should be 1 members in inner ring', function() {
        expect(rings[1].members.length).to.equal(1);
      });
      it('should be true for outer ring', function() {
        expect(rings[0].canRotate).to.be.true;
      });
      it('should be false for inner ring', function() {
        expect(rings[1].canRotate).to.be.false;
      });
    });
  });
});
