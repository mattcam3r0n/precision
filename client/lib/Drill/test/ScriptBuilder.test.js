import { expect } from 'meteor/practicalmeteor:chai';

import ScriptBuilder from '/client/lib/drill/ScriptBuilder';
import MemberFactory from '/client/lib/drill/MemberFactory';
import StepType from '/client/lib/StepType';
import StrideType from '/client/lib/StrideType';
import Direction from '/client/lib/Direction';
import MemberPositionCalculator from '/client/lib/drill/MemberPositionCalculator';

describe('ScriptBuilder', function () {

    var strideType = StrideType.SixToFive;
    var dir = Direction.E;
    var stepPoint = {
        x: 6,
        y: 6
    };

    var member;

    beforeEach(function () {
        member = MemberFactory.createMember(strideType, dir, stepPoint);
    });

    describe('addActionAtCount', function () {

        it('should add action at index 0 (count 1)', function () {
            var action = {
                strideType: StrideType.SixToFive,
                stepType: StepType.Full,
                direction: Direction.S
            };
            ScriptBuilder.addActionAtCount(member, action, 1);

            // add at steps + 1
            expect(member.script.length).to.equal(1);
        })

    })

    describe('addActionAtPoint', function () {

        it('should add action at index 0 (count 1)', function () {
            var action = {
                strideType: StrideType.SixToFive,
                stepType: StepType.Full,
                direction: Direction.S
            };
            var point = {
                x: 6,
                y: 6
            };
            ScriptBuilder.addActionAtPoint(member, action, point);
            expect(member.script.length).to.equal(1);
        })

        it('should add action at index 2 (count 3)', function () {
            var action = {
                strideType: StrideType.SixToFive,
                stepType: StepType.Full,
                direction: Direction.S
            };
            var point = {
                x: 8,
                y: 6
            };
            ScriptBuilder.addActionAtPoint(member, action, point);
            // add at steps + 1
            expect(member.script.length).to.equal(3);
        })

        it('should add action at index 6 (count 7)', function () {
            var action = {
                strideType: StrideType.SixToFive,
                stepType: StepType.Full,
                direction: Direction.S
            };
            var point = {
                x: 12,
                y: 6
            };
            ScriptBuilder.addActionAtPoint(member, action, point);

            // add at steps + 1
            expect(member.script.length).to.equal(7);
        })

        it('should not add action if point is not in path', function () {
            var action = {
                strideType: StrideType.SixToFive,
                stepType: StepType.Full,
                direction: Direction.S
            };
            var point = {
                x: 12,
                y: 8
            };
            ScriptBuilder.addActionAtPoint(member, action, point);

            // add at steps + 1
            expect(member.script.length).to.equal(0);
        })

    })


})
