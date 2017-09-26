import { expect } from 'meteor/practicalmeteor:chai';
import ScriptNode from '/client/lib/Drill/ScriptNode';
import Direction from '/client/lib/Direction';
import StrideType from '/client/lib/StrideType';
import StepType from '/client/lib/StepType';
import StepDelta from '/client/lib/Drill/StepDelta';

describe('ScriptNode', function () {

    it('should initialize properties upon construction', function () {
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
