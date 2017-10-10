import { expect } from 'meteor/practicalmeteor:chai';

import MemberPositionCalculator from '/client/lib/drill/MemberPositionCalculator';
import MemberFactory from '/client/lib/drill/MemberFactory';
import Direction from '/client/lib/Direction';
import StrideType from '/client/lib/StrideType';
import StepType from '/client/lib/StepType';
import StepFactory from '/client/lib/drill/StepFactory';

describe('MemberPositionCalculator', function () {

    var member;

    beforeEach(function () {
        member = MemberFactory.createMember(StrideType.SixToFive, Direction.E, { x: 0, y: 0 });
    });

    // describe('goToBeginning', function() {
    //     it('should return to initial state', function() {
    //         var step = StepFactory.createStep(StrideType.SixToFive, StepType.Full, Direction.S);
    //         member.script.push(step);
    //         MemberPositionCalculator.stepForward(member);
    //         MemberPositionCalculator.goToBeginning(member);
    //         expect(member.currentState.x).to.equal(member.initialState.x);
    //         expect(member.currentState.y).to.equal(member.initialState.y);   
    //         expect(member.currentState.direction).to.equal(member.initialState.direction); 
    //     })
    // })

    // describe('isBeginningOfDrill', function() {
    //     beforeEach(function() {
    //         // set up a drill with one step in it
    //         var step = StepFactory.createStep(StrideType.SixToFive, StepType.Full, Direction.S);
    //         member.script.push(step);
    //     })

    //     it('should return true when at beginning of drill', function () {
    //         // should be at beginning since no moves have been made
    //         expect(MemberPositionCalculator.isBeginningOfDrill(member)).to.be.true;
    //     })
            
    //     it('should return false when not at beginning of drill', function () {
    //         // take a step forward
    //         MemberPositionCalculator.stepForward(member);
    //         expect(MemberPositionCalculator.isBeginningOfDrill(member)).to.be.false;            
    //     })
    // })

    // describe('isEndOfDrill', function() {
    //     beforeEach(function() {
    //         // set up a drill with one step in it
    //         var step = StepFactory.createStep(StrideType.SixToFive, StepType.Full, Direction.S);
    //         member.script.push(step);
    //     })

    //     it('should return true when at end of drill', function () {
    //         // should NOT be at end since we just initialized and there is one step in drill
    //         expect(MemberPositionCalculator.isEndOfDrill(member)).to.be.false;
    //     })
            
    //     it('should return false when not at end of drill', function () {
    //         // step forward one step, which should be end
    //         MemberPositionCalculator.stepForward(member);
    //         expect(MemberPositionCalculator.isEndOfDrill(member)).to.be.true;            
    //     })
    // })

    // describe('isBeyondEndOfDrill', function() {
    //     beforeEach(function() {
    //         // set up a drill with one step in it
    //         var step = StepFactory.createStep(StrideType.SixToFive, StepType.Full, Direction.S);
    //         member.script.push(step);
    //     })

    //     it('should return false when not at end of drill', function () {
    //         // should NOT be at end since we just initialized and there is one step in drill
    //         expect(MemberPositionCalculator.isBeyondEndOfDrill(member)).to.be.false;
    //     })

    //     it('should return false when at exactly at end of drill', function () {
    //         // should be at end since there is one step in drill
    //         MemberPositionCalculator.stepForward(member);
    //         expect(MemberPositionCalculator.isBeyondEndOfDrill(member)).to.be.false;
    //     })

    //     it('should return true when past end of drill', function () {
    //         // step forward two steps, which is beyond end of drill
    //         MemberPositionCalculator.stepForward(member);
    //         MemberPositionCalculator.stepForward(member);
    //         expect(MemberPositionCalculator.isBeyondEndOfDrill(member)).to.be.true;            
    //     })
    // })
    
    // describe('stepForward', function() {
    //     beforeEach(function() {
    //         var step = StepFactory.createStep(StrideType.SixToFive, StepType.Full, Direction.E);
    //         member.script.push(step);
    //     })

    //     it('should step forward one step E', function() {
    //         var pos = MemberPositionCalculator.stepForward(member);

    //         expect(member.currentState.x).to.equal(member.initialState.x); // should not change state
    //         expect(pos.x).to.equal(member.initialState.x + 1); 
    //     })
    // })

    describe('stepBackward', function() {
        beforeEach(function() {
            var step = StepFactory.createStep(StrideType.SixToFive, StepType.Full, Direction.E);
            member.script.push(step);
            member.currentState.count = 1;
            member.currentState.x = 1;
        })

        it('should step backward one step E', function() {
            var pos = MemberPositionCalculator.stepBackward(member);
            expect(member.currentState.x).to.equal(1); // should not change state
            expect(member.currentState.count).to.equal(1); // should not change state
            expect(pos.x).to.equal(member.initialState.x); 
        })
    })
    
    // describe('goToBeginning', function() {
    //     beforeEach(function() {
    //         var step = StepFactory.createStep(StrideType.SixToFive, StepType.Full, Direction.E);
    //         member.script.push(step);
    //         member.currentState.count = 1;
    //         member.currentState.x = 1;
    //     })

    //     it('should return beginning position, without changing member state', function() {
    //         var pos = MemberPositionCalculator.stepBackward(member);
    //         expect(member.currentState.x).to.equal(1); // should not change state
    //         expect(member.currentState.count).to.equal(1); // should not change state
    //         expect(pos.x).to.equal(member.initialState.x); 
    //     })
    // })

});
