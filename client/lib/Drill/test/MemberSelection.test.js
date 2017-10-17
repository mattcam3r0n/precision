import { expect } from 'meteor/practicalmeteor:chai';

import MemberSelection from '/client/lib/drill/MemberSelection';
import MemberFactory from '/client/lib/drill/MemberFactory';
import StepType from '/client/lib/StepType';
import StrideType from '/client/lib/StrideType';
import Direction from '/client/lib/Direction';

describe('MemberSelection', function () {

    var strideType = StrideType.SixToFive;
    var dir = Direction.E;

    var members;

    beforeEach(function () {
        /**
         * A A A
         * B B B
         * C C C
         */
        members = [
            MemberFactory.createMember(strideType, dir, { x: 0, y: 0 }),
            MemberFactory.createMember(strideType, dir, { x: 2, y: 0 }),
            MemberFactory.createMember(strideType, dir, { x: 4, y: 0 }),

            MemberFactory.createMember(strideType, dir, { x: 0, y: 2 }),
            MemberFactory.createMember(strideType, dir, { x: 2, y: 2 }),
            MemberFactory.createMember(strideType, dir, { x: 4, y: 2 }),

            MemberFactory.createMember(strideType, dir, { x: 0, y: 4 }),
            MemberFactory.createMember(strideType, dir, { x: 2, y: 4 }),
            MemberFactory.createMember(strideType, dir, { x: 4, y: 4 })
        ];
    });

    describe('getClosestMember', function () {

        it('Closest member to 6,2 is at 4,2', function () {

            /**
             * A A A
             * B B B  X
             * C C C
             */

            var selection = new MemberSelection(members);
            var closest = selection.getClosestMember({ x: 6, y: 2 });

            console.log(closest);

            expect(closest).to.not.be.null;
            expect(closest.currentState.x).to.equal(4);
            expect(closest.currentState.y).to.equal(2);
        })

        it('Closest member to 10,4 is at 4,4', function () {

            /**
             * A A A
             * B B B  
             * C C C     X
             */

            var selection = new MemberSelection(members);
            var closest = selection.getClosestMember({ x: 10, y: 4 });

            console.log(closest);

            expect(closest).to.not.be.null;
            expect(closest.currentState.x).to.equal(4);
            expect(closest.currentState.y).to.equal(4);
        })

    })

})
