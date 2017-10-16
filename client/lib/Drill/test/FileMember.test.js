import { expect } from 'meteor/practicalmeteor:chai';

import MemberFactory from '/client/lib/drill/MemberFactory';
import FileMember from '/client/lib/drill/FileMember';
import StepDelta from '/client/lib/StepDelta';
import StepType from '/client/lib/StepType';
import StrideType from '/client/lib/StrideType';
import Direction from '/client/lib/Direction';
//import StepDelta from '/client/lib/StepDelta';

describe('FileMember', function () {

    var fileMember;

    function createScript(scriptShorthand) {
        return scriptShorthand.map(d => {
            let delta = StepDelta.getDelta(StrideType.SixToFive, StepType.Full, Direction[d]);
            return {
                strideType: StrideType.SixToFive,
                stepType: StepType.Full,
                direction: Direction[d],
                deltaX: delta.deltaX,
                deltaY: delta.deltaY
            };
        })
    }

    function createMember(initX, initY, initDir, scriptShorthand, count) {
        var script = createScript(scriptShorthand);
        var m = MemberFactory.createMember(StrideType.SixToFive, initDir, { x: initX, y: initY });
        for (var i = 0; i < count; i++) {
            var step = script[i];
            var state = m.currentState;
            state.count++;
            state.direction = step.direction;
            state.stepType = step.stepType;
            state.strideType = step.strideType;
            state.x += step.deltaX; 
            state.y += step.deltaY;
        }
        return m;
    }

    describe('getStepsToLeader', function () {
        beforeEach(function () {
            var strideType = StrideType.SixToFive;
            var stepType = StepType.Full;
            var dir = Direction.E;
            members = [
                MemberFactory.createMember(strideType, dir, { x: 0, y: 0 }),
                MemberFactory.createMember(strideType, dir, { x: 2, y: 0 })
            ];

            members[1].script[0] = {
                strideType: StrideType.SixToFive,
                stepType: StepType.Full,
                direction: Direction.S
            };
            members[1].script[2] = {
                strideType: StrideType.SixToFive,
                stepType: StepType.Full,
                direction: Direction.E
            };

            members[0].script[2] = {
                strideType: StrideType.SixToFive,
                stepType: StepType.Full,
                direction: Direction.S
            };

            members[0].script[4] = {
                strideType: StrideType.SixToFive,
                stepType: StepType.Full,
                direction: Direction.E
            };

            fileSelector = new FileSelector(members);
        });

        it('should get 2 steps S', function () {
            // start facing E, leader immediately takes 2 steps S
            fileMember = new FileMember(createMember(0, 0, Direction.E, ['E','E'], 2));
            fileMember.following = new FileMember(createMember(2, 0, Direction.E, ['S','S'], 2));
            var steps = fileMember.getStepsToLeader();

            expect(steps).to.equal(2);
            // expect(steps.length).to.equal(2);
            // expect(steps[0].direction).to.equal(Direction.S);
            // expect(steps[1].direction).to.equal(Direction.S);
        })

        it('should get 2 steps E', function () {
            // start facing E, leader immediately takes 2 steps E
            fileMember = new FileMember(createMember(0, 0, Direction.E, ['E','E'], 2));
            fileMember.following = new FileMember(createMember(2, 0, Direction.E, ['E','E'], 2));
            var steps = fileMember.getStepsToLeader();
            expect(steps.length).to.equal(2);
        console.log(steps);
            expect(steps[0].direction).to.equal(Direction.E);
            // expect(steps[1].direction).to.equal(Direction.E);
        })

        it('should get 2 steps, E S', function () {
    console.log('should get 2 steps E S');
            // start facing E, leader takes 3 steps E E S
            fileMember = new FileMember(createMember(0, 0, Direction.E, ['E','E','E'], 3));
            fileMember.following = new FileMember(createMember(2, 0, Direction.E, ['E','E','S'], 3));
    console.log('start here');
            var steps = fileMember.getStepsToLeader();
    console.log(steps);
            expect(steps.length).to.equal(2);
            expect(steps[0].direction).to.equal(Direction.E);
            expect(steps[1].direction).to.equal(Direction.S);
        })

        it('should interpolate 2 steps S, when at initial pos', function () {
            // start facing E, leader immediately takes 2 steps S
            fileMember = new FileMember(createMember(0, 0, Direction.E, ['E','E'], 0));
            fileMember.following = new FileMember(createMember(2, 0, Direction.E, ['S','S'], 0));

            var steps = fileMember.getStepsToLeader();

            // expect(steps.length).to.equal(2);
            // expect(steps[0].direction).to.equal(Direction.S);
            // expect(steps[1].direction).to.equal(Direction.S);
        })

    })


})
