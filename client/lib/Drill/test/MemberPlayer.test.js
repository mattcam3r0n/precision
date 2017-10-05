import { expect } from 'meteor/practicalmeteor:chai';

import MemberPlayer from '/client/lib/drill/MemberPlayer';
import MemberFactory from '/client/lib/drill/MemberFactory';
import Direction from '/client/lib/Direction';
import StrideType from '/client/lib/StrideType';
import StepType from '/client/lib/StepType';
import StepFactory from '/client/lib/drill/StepFactory';

describe('MemberPlayer', function () {

    var member;

    beforeEach(function () {
        console.log('beforeEach');
        member = MemberFactory.createMember(StrideType.SixToFive, Direction.E, { x: 0, y: 0 });
    });

    describe('isBeginningOfDrill', function() {
        beforeEach(function() {
            // set up a drill with one step in it
            var step = StepFactory.createStep(StrideType.SixToFive, StepType.Full, Direction.S);
            member.script.push(step);
        })

        it('should return true when at beginning of drill', function () {
            // should be at beginning since no moves have been made
            expect(MemberPlayer.isBeginningOfDrill(member)).to.be.true;
        })
            
        it('should return false when not at beginning of drill', function () {
            // take a step forward
            MemberPlayer.stepForward(member);
            expect(MemberPlayer.isBeginningOfDrill(member)).to.be.false;            
        })
    })

    describe('isEndOfDrill', function() {
        beforeEach(function() {
            // set up a drill with one step in it
            var step = StepFactory.createStep(StrideType.SixToFive, StepType.Full, Direction.S);
            member.script.push(step);
        })

        it('should return true when at end of drill', function () {
            // should NOT be at end since we just initialized and there is one step in drill
            expect(MemberPlayer.isEndOfDrill(member)).to.be.false;
        })
            
        it('should return false when not at end of drill', function () {
            // step forward one step, which should be end
            MemberPlayer.stepForward(member);
            expect(MemberPlayer.isEndOfDrill(member)).to.be.true;            
        })
    })

    describe('isBeyondEndOfDrill', function() {
        beforeEach(function() {
            // set up a drill with one step in it
            var step = StepFactory.createStep(StrideType.SixToFive, StepType.Full, Direction.S);
            member.script.push(step);
        })

        it('should return false when not at end of drill', function () {
            // should NOT be at end since we just initialized and there is one step in drill
            expect(MemberPlayer.isBeyondEndOfDrill(member)).to.be.false;
        })

        it('should return false when at exactly at end of drill', function () {
            // should be at end since there is one step in drill
            MemberPlayer.stepForward(member);
            expect(MemberPlayer.isBeyondEndOfDrill(member)).to.be.false;
        })

        it('should return true when past end of drill', function () {
            // step forward two steps, which is beyond end of drill
            MemberPlayer.stepForward(member);
            MemberPlayer.stepForward(member);
            expect(MemberPlayer.isBeyondEndOfDrill(member)).to.be.true;            
        })
    })
    
    
    // it('should calculate deltaX and deltaY if not given', function () {
    //     expect.fail('to do');
    // })

    /**
     * TO DO
     * 
     * - non-standard step types, deltX/Y
     * -  
     * 
     */

});
