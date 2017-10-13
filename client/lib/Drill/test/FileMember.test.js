import { expect } from 'meteor/practicalmeteor:chai';

import FileMember from '/client/lib/drill/FileMember';
import StepType from '/client/lib/StepType';
import StrideType from '/client/lib/StrideType';
import Direction from '/client/lib/Direction';
import StepDelta from '/client/lib/StepDelta';

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
        // create member, move to given count
        var m = {
            initialState: { x: initX, y: initY, direction: initDir, strideType: script[0].strideType },
            currentState: { count: 0, x: initX, y: initY, direction: initDir, strideType: script[0].strideType },
            script: script
        };
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
        });

        it('should get 2 steps S', function () {
            // start facing E, leader immediately takes 2 steps S
            fileMember = new FileMember(createMember(0, 0, Direction.E, ['E','E'], 2));
            fileMember.following = new FileMember(createMember(2, 0, Direction.E, ['S','S'], 2));
            var steps = fileMember.getStepsToLeader();
            expect(steps.length).to.equal(2);
            expect(steps[0].direction).to.equal(Direction.S);
            expect(steps[1].direction).to.equal(Direction.S);
        })

        it('should get 2 steps E', function () {
            // start facing E, leader immediately takes 2 steps E
            fileMember = new FileMember(createMember(0, 0, Direction.E, ['E','E'], 2));
            fileMember.following = new FileMember(createMember(2, 0, Direction.E, ['E','E'], 2));
            var steps = fileMember.getStepsToLeader();
            expect(steps.length).to.equal(2);
            expect(steps[0].direction).to.equal(Direction.E);
            expect(steps[1].direction).to.equal(Direction.E);
        })

        it('should get 2 steps, E S', function () {
            // start facing E, leader takes 3 steps E E S
            fileMember = new FileMember(createMember(0, 0, Direction.E, ['E','E','E'], 3));
            fileMember.following = new FileMember(createMember(2, 0, Direction.E, ['E','E','S'], 3));
            var steps = fileMember.getStepsToLeader();
            expect(steps.length).to.equal(2);
            expect(steps[0].direction).to.equal(Direction.E);
            expect(steps[1].direction).to.equal(Direction.S);
        })

        it('should interpolate 2 steps S, when at initial pos', function () {
            // start facing E, leader immediately takes 2 steps S
            fileMember = new FileMember(createMember(0, 0, Direction.E, ['E','E'], 0));
            fileMember.following = new FileMember(createMember(2, 0, Direction.E, ['S','S'], 0));

            var steps = fileMember.getStepsToLeader();

console.log(steps);
            // expect(steps.length).to.equal(2);
            // expect(steps[0].direction).to.equal(Direction.S);
            // expect(steps[1].direction).to.equal(Direction.S);
        })

    })


})
