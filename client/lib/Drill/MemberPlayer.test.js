import { expect } from 'meteor/practicalmeteor:chai';

import MemberPlayer from '/client/lib/drill/MemberPlayer';
import MemberFactory from '/client/lib/drill/MemberFactory';
import Direction from '/client/lib/Direction';
import StrideType from '/client/lib/StrideType';
import StepType from '/client/lib/StepType';
import StepFactory from '/client/lib/drill/StepFactory';

describe('MemberPlayer', function () {

    var member;

    beforeEach(function() {
        member = MemberFactory.createMember(StrideType.SixToFive, Direction.E, { x: 0, y: 0 });
    });

    it('should stepForward one full step E', function() {

        var step = StepFactory.createStep(StrideType.SixToFive, StepType.Full, Direction.E);
        member.script.push(step);

        MemberPlayer.stepForward(member);

        console.log(member, step);

        // assumes we're starting from 0,0
        expect(member.currentState.x).to.equal(1);
        expect(member.currentState.y).to.equal(0);
    })

    it('should calculate deltaX and deltaY if not given', function () {
        expect().fail();
    })

  });
