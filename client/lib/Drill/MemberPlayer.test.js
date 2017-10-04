import { expect } from 'meteor/practicalmeteor:chai';
import MemberPlayer from '/client/lib/drill/MemberPlayer';
import Direction from '/client/lib/Direction';
import StrideType from '/client/lib/StrideType';

describe('MemberPlayer', function () {

    var member;

    beforeEach(function() {
        member = {
            id: '1',
            initialState: {
                x: 0,
                y: 0,
                direction: Direction.E,
                strideType: StrideType.SixToFive
            },
            currentState: {
                x: 0,
                y: 0,
                direction: Direction.E,
                strideType: StrideType.SixToFive,
                count: 0
            },
            script: []
        };
    });

    it('should stepForward', function() {

        MemberPlayer.stepForward(m);

        var n = new ScriptNode(StrideType.SixToFive, StepType.Full, Direction.E, 5, 5);
      expect(n.stepType).to.equal(StepType.Full);
      expect(n.direction).to.equal(Direction.E);
      expect(n.deltaX).to.equal(5);
      expect(n.deltaY).to.equal(5);
    })

    it('should calculate deltaX and deltaY if not given', function () {
      var n = new ScriptNode(StrideType.SixToFive, StepType.Full, Direction.E); // deltas not supplied
      expect(n.deltaX).to.equal(StepDelta[StrideType.SixToFive][StepType.Full][Direction.E].deltaX);
      expect(n.deltaY).to.equal(StepDelta[StrideType.SixToFive][StepType.Full][Direction.E].deltaY);
    })

  })
