// import { expect } from 'meteor/practicalmeteor:chai';
import { expect } from 'chai';

import MemberFactory from '/client/lib/drill/MemberFactory';
import StepType from '/client/lib/StepType';
import StrideType from '/client/lib/StrideType';
import Direction from '/client/lib/Direction';

describe('MemberFactory', function () {

    var strideType = StrideType.SixToFive;
    var dir = Direction.E;
    var stepPoint = {
        x: 6,
        y: 6
    };

    var member;

    beforeEach(function() {
        member = MemberFactory.createMember(strideType, dir, stepPoint);
    });

    it('should set initialState', function() {
        expect(member.initialState.strideType).to.equal(strideType);
        expect(member.initialState.direction).to.equal(dir);
        expect(member.initialState.x).to.equal(stepPoint.x);
        expect(member.initialState.y).to.equal(stepPoint.y);
    })

    it('should set currentState to initialState', function() {
        expect(member.initialState.strideType).to.equal(strideType);
        expect(member.initialState.direction).to.equal(dir);
        expect(member.initialState.x).to.equal(stepPoint.x);
        expect(member.initialState.y).to.equal(stepPoint.y);
    })

    it('should set currentState.count to 0', function() {
        expect(member.currentState.count).to.equal(0);
    })

    it('should assign a default id', function() {
        expect(member.id).to.not.be.null;
    })

    it('should intialize an empty script', function() {
        expect(member.script).to.be.an('array');
        expect(member.script.length).to.equal(0);
    })

  })
