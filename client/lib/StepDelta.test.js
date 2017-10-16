import { expect } from 'meteor/practicalmeteor:chai';

import Direction from '/client/lib/Direction';
import StrideType from '/client/lib/StrideType';
import StepType from '/client/lib/StepType';
import StepDelta from '/client/lib/StepDelta';

describe('StepDelta', function () {

    before(function() {
    });

    // 6/5, Full
    it('one full 6/5 step N should give { deltaX: 0, deltaY: -1 }', function() {
        var d = StepDelta.getDelta(StrideType.SixToFive, StepType.Full, Direction.N);
        expect(d).to.eql({ deltaX: 0, deltaY: -1 });
    })

    it('one full 6/5 step E should give { deltaX: 1, deltaY: 0 }', function() {
        var d = StepDelta.getDelta(StrideType.SixToFive, StepType.Full, Direction.E);
        expect(d).to.eql({ deltaX: 1, deltaY: 0 });
    })

    it('one full 6/5 step S should give { deltaX: 0, deltaY: 1 }', function() {
        var d = StepDelta.getDelta(StrideType.SixToFive, StepType.Full, Direction.S);
        expect(d).to.eql({ deltaX: 0, deltaY: 1 });
    })

    it('one full 6/5 step W should give { deltaX: -1, deltaY: 0 }', function() {
        var d = StepDelta.getDelta(StrideType.SixToFive, StepType.Full, Direction.W);
        expect(d).to.eql({ deltaX: -1, deltaY: 0 });
    })

    // 6/5, Oblique
    it('one full 6/5 step NE should give { deltaX: 6/8, deltaY: -6/8 }', function() {
        var d = StepDelta.getDelta(StrideType.SixToFive, StepType.Full, Direction.NE);
        expect(d).to.eql({ deltaX: 6/8, deltaY: -6/8 });
    })

    it('one full 6/5 step SE should give { deltaX: 6/8, deltaY: 6/8 }', function() {
        var d = StepDelta.getDelta(StrideType.SixToFive, StepType.Full, Direction.SE);
        expect(d).to.eql({ deltaX: 6/8, deltaY: 6/8 });
    })

    it('one full 6/5 step SW should give { deltaX: -6/8, deltaY: 6/8 }', function() {
        var d = StepDelta.getDelta(StrideType.SixToFive, StepType.Full, Direction.SW);
        expect(d).to.eql({ deltaX: -6/8, deltaY: 6/8 });
    })

    it('one full 6/5 step NW should give { deltaX: -6/8, deltaY: -6/8 }', function() {
        var d = StepDelta.getDelta(StrideType.SixToFive, StepType.Full, Direction.NW);
        expect(d).to.eql({ deltaX: -6/8, deltaY: -6/8 });
    })

    // 8/5, Full
    it('one full 8/5 step N should give { deltaX: 0, deltaY: -1 }', function() {
        var d = StepDelta.getDelta(StrideType.EightToFive, StepType.Full, Direction.N);
        expect(d).to.eql({ deltaX: 0, deltaY: -1 });
    })

    it('one full 8/5 step E should give { deltaX: 1, deltaY: 0 }', function() {
        var d = StepDelta.getDelta(StrideType.EightToFive, StepType.Full, Direction.E);
        expect(d).to.eql({ deltaX: 1, deltaY: 0 });
    })

    it('one full 8/5 step S should give { deltaX: 0, deltaY: 1 }', function() {
        var d = StepDelta.getDelta(StrideType.EightToFive, StepType.Full, Direction.S);
        expect(d).to.eql({ deltaX: 0, deltaY: 1 });
    })

    it('one full 8/5 step W should give { deltaX: -1, deltaY: 0 }', function() {
        var d = StepDelta.getDelta(StrideType.EightToFive, StepType.Full, Direction.W);
        expect(d).to.eql({ deltaX: -1, deltaY: 0 });
    })

    // 8/5, Oblique
    it('one full 8/5 step NE should give { deltaX: 8/12, deltaY: -8/12 }', function() {
        var d = StepDelta.getDelta(StrideType.EightToFive, StepType.Full, Direction.NE);
        expect(d).to.eql({ deltaX: 8/12, deltaY: -8/12 });
    })

    it('one full 8/5 step SE should give { deltaX: 8/12, deltaY: 8/12 }', function() {
        var d = StepDelta.getDelta(StrideType.EightToFive, StepType.Full, Direction.SE);
        expect(d).to.eql({ deltaX: 8/12, deltaY: 8/12 });
    })

    it('one full 8/5 step SW should give { deltaX: -8/12, deltaY: 8/12 }', function() {
        var d = StepDelta.getDelta(StrideType.EightToFive, StepType.Full, Direction.SW);
        expect(d).to.eql({ deltaX: -8/12, deltaY: 8/12 });
    })

    it('one full 8/5 step NW should give { deltaX: -8/12, deltaY: -8/12 }', function() {
        var d = StepDelta.getDelta(StrideType.EightToFive, StepType.Full, Direction.NW);
        expect(d).to.eql({ deltaX: -8/12, deltaY: -8/12 });
    })

    describe('getStepsBetweenPoints', function(){

        it('should equal 6', function() {
            var a = { x: 0, y: 0 };
            var b = { x: 6, y: 0 };
            var steps = StepDelta.getStepsBetweenPoints(StrideType.SixToFive, StepType.Full, a, b);
            expect(steps).to.equal(6);
        })    

        it('should equal 6', function() {
            var a = { x: 0, y: 0 };
            var b = { x: 0, y: 6 };
            var steps = StepDelta.getStepsBetweenPoints(StrideType.SixToFive, StepType.Full, a, b);
            expect(steps).to.equal(6);
        })    

        it('should equal 3', function() {
            var a = { x: 0, y: 3 };
            var b = { x: 0, y: 0 };
            var steps = StepDelta.getStepsBetweenPoints(StrideType.SixToFive, StepType.Full, a, b);
            expect(steps).to.equal(3);
        })    

        it('6/5 oblique: should equal 8', function() {
            var a = { x: 0, y: 0 };
            var b = { x: 6, y: 6 };
            var steps = StepDelta.getStepsBetweenPoints(StrideType.SixToFive, StepType.Full, a, b);
            expect(steps).to.equal(8);
        })

        it('6/5 oblique: should equal 4', function() {
            var a = { x: 0, y: 0 };
            var b = { x: 3, y: 3 };
            var steps = StepDelta.getStepsBetweenPoints(StrideType.SixToFive, StepType.Full, a, b);
            expect(steps).to.equal(4);
        })

    })

});
