// import { expect } from 'meteor/practicalmeteor:chai';
import { expect } from 'chai';

import MemberPlayer from '/client/lib/drill/MemberPlayer';
import MemberFactory from '/client/lib/drill/MemberFactory';
import Direction from '/client/lib/Direction';
import StrideType from '/client/lib/StrideType';
import StepType from '/client/lib/StepType';
import StepFactory from '/client/lib/drill/StepFactory';

describe('MemberPlayer', function () {

    var member;

    beforeEach(function () {
        member = MemberFactory.createMember(StrideType.SixToFive, Direction.E, { x: 0, y: 0 });
    });

    describe('stepBackward', function () {

        it('rewind one full step N', function () {
            var step = StepFactory.createStep(StrideType.SixToFive, StepType.Full, Direction.N);
            member.script.push(step);

            MemberPlayer.stepForward(member);
            expect(member.currentState.x).to.equal(0);
            expect(member.currentState.y).to.equal(-1);
            // and back to initial direction
            expect(member.currentState.direction).to.equal(Direction.N);

            MemberPlayer.stepBackward(member);            
            // assumes we're starting from 0,0, end up back at 0,0
            expect(member.currentState.x).to.equal(0);
            expect(member.currentState.y).to.equal(0);
            // and back to initial direction
            expect(member.currentState.direction).to.equal(member.initialState.direction);
        })

        it('rewind one full step E', function () {
            var step = StepFactory.createStep(StrideType.SixToFive, StepType.Full, Direction.E);
            member.script.push(step);

            MemberPlayer.stepForward(member);
            MemberPlayer.stepBackward(member);

            // assumes we're starting from 0,0, end up back at 0,0
            expect(member.currentState.x).to.equal(0);
            expect(member.currentState.y).to.equal(0);
        })

        it('rewind one full step S', function () {
            var step = StepFactory.createStep(StrideType.SixToFive, StepType.Full, Direction.S);
            member.script.push(step);

            MemberPlayer.stepForward(member);
            MemberPlayer.stepBackward(member);

            // assumes we're starting from 0,0, end up back at 0,0
            expect(member.currentState.x).to.equal(0);
            expect(member.currentState.y).to.equal(0);
        })

        it('rewind one full step W', function () {
            var step = StepFactory.createStep(StrideType.SixToFive, StepType.Full, Direction.W);
            member.script.push(step);

            MemberPlayer.stepForward(member);
            MemberPlayer.stepBackward(member);

            // assumes we're starting from 0,0, end up back at 0,0
            expect(member.currentState.x).to.equal(0);
            expect(member.currentState.y).to.equal(0);
        })

        it('should not rewind beyond beginning', function () {
            var step = StepFactory.createStep(StrideType.SixToFive, StepType.Full, Direction.N);
            member.script.push(step);
            
            MemberPlayer.stepForward(member);
            MemberPlayer.stepBackward(member);
            MemberPlayer.stepBackward(member); // try stepping back too far
            
            // assumes we're starting from 0,0, end up back at 0,0
            expect(member.currentState.x).to.equal(member.initialState.x);
            expect(member.currentState.y).to.equal(member.initialState.y);
            expect(member.currentState.direction).to.equal(member.initialState.direction);
        })
        
    })

    /**
     * TO DO
     * 
     * - non-standard step types, deltX/Y
     * -  
     * 
     */

});
