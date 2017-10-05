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

    describe('stepForward', function () {

        it('should stepForward one full step N', function () {
            var step = StepFactory.createStep(StrideType.SixToFive, StepType.Full, Direction.N);
            member.script.push(step);

            MemberPlayer.stepForward(member);

            // assumes we're starting from 0,0
            expect(member.currentState.x).to.equal(0);
            expect(member.currentState.y).to.equal(-1);
        })

        it('should stepForward one full step E', function () {
            var step = StepFactory.createStep(StrideType.SixToFive, StepType.Full, Direction.E);
            member.script.push(step);

            MemberPlayer.stepForward(member);

            // assumes we're starting from 0,0
            expect(member.currentState.x).to.equal(1);
            expect(member.currentState.y).to.equal(0);
        })

        it('should stepForward one full step S', function () {
            var step = StepFactory.createStep(StrideType.SixToFive, StepType.Full, Direction.S);
            member.script.push(step);

            MemberPlayer.stepForward(member);

            // assumes we're starting from 0,0
            expect(member.currentState.x).to.equal(0);
            expect(member.currentState.y).to.equal(1);
        })

        it('should stepForward one full step W', function () {
            var step = StepFactory.createStep(StrideType.SixToFive, StepType.Full, Direction.W);
            member.script.push(step);

            MemberPlayer.stepForward(member);

            // assumes we're starting from 0,0
            expect(member.currentState.x).to.equal(-1);
            expect(member.currentState.y).to.equal(0);
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
