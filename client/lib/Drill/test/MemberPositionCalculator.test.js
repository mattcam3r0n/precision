// import { expect } from 'meteor/practicalmeteor:chai';
import { expect } from 'chai';

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

    describe('goToBeginning', function() {
        it('should return to initial state', function() {
            var step = StepFactory.createStep(StrideType.SixToFive, StepType.Full, Direction.S);
            member.script.push(step);
            MemberPositionCalculator.stepForward(member);
            MemberPositionCalculator.goToBeginning(member);
            expect(member.currentState.x).to.equal(member.initialState.x);
            expect(member.currentState.y).to.equal(member.initialState.y);   
            expect(member.currentState.direction).to.equal(member.initialState.direction); 
        })
    })

    describe('isBeginningOfDrill', function() {
        beforeEach(function() {
            // set up a drill with one step in it
            var step = StepFactory.createStep(StrideType.SixToFive, StepType.Full, Direction.S);
            member.script.push(step);
        })

        it('should return true when at beginning of drill', function () {
            var position = member.currentState;
            // should be at beginning since no moves have been made
            expect(MemberPositionCalculator.isBeginningOfDrill(member, position)).to.be.true;
        })
            
        it('should return false when not at beginning of drill', function () {
            var position = member.currentState;
            // take a step forward
            position = MemberPositionCalculator.stepForward(member);
            expect(MemberPositionCalculator.isBeginningOfDrill(member, position)).to.be.false;            
        })
    })

    describe('isEndOfDrill', function() {
        beforeEach(function() {
            // set up a drill with one step in it
            var step = StepFactory.createStep(StrideType.SixToFive, StepType.Full, Direction.S);
            member.script.push(step);
        })

        it('should return true when at end of drill', function () {
            var position = member.currentState;
            // should NOT be at end since we just initialized and there is one step in drill
            expect(MemberPositionCalculator.isEndOfDrill(member, position)).to.be.false;
        })
            
        it('should return false when not at end of drill', function () {
            // step forward one step, which should be end
            var position = MemberPositionCalculator.stepForward(member);
            expect(MemberPositionCalculator.isEndOfDrill(member, position)).to.be.true;            
        })
    })

    describe('isBeyondEndOfDrill', function() {
        beforeEach(function() {
            // set up a drill with one step in it
            var step = StepFactory.createStep(StrideType.SixToFive, StepType.Full, Direction.S);
            member.script.push(step);
        })

        it('should return false when not at end of drill', function () {
            var position = member.currentState;
            // should NOT be at end since we just initialized and there is one step in drill
            expect(MemberPositionCalculator.isBeyondEndOfDrill(member, position)).to.be.false;
        })

        it('should return false when at exactly at end of drill', function () {
            // should be at end since there is one step in drill
            var position = MemberPositionCalculator.stepForward(member);
            expect(MemberPositionCalculator.isBeyondEndOfDrill(member, position)).to.be.false;
        })

        it('should return true when past end of drill', function () {
            // step forward two steps, which is beyond end of drill
            var position = MemberPositionCalculator.stepForward(member);
            position = MemberPositionCalculator.stepForward(member, position);
            expect(MemberPositionCalculator.isBeyondEndOfDrill(member, position)).to.be.true;            
        })
    })
    
    describe('stepForward', function() {
        beforeEach(function() {
            // var step = StepFactory.createStep(StrideType.SixToFive, StepType.Full, Direction.E);
            // member.script.push(step);
        })

        it('should step forward one step E, from initial state', function() {
            var pos = MemberPositionCalculator.stepForward(member);
            expect(member.currentState.x).to.equal(member.initialState.x); // should not change state
            expect(pos.x).to.equal(member.initialState.x + 1); 
        })

        it('should continue forward 3 steps E, from initial state', function() {
            var pos = MemberPositionCalculator.stepForward(member);
            pos = MemberPositionCalculator.stepForward(member, pos);
            pos = MemberPositionCalculator.stepForward(member, pos);
            expect(member.currentState.x).to.equal(member.initialState.x); // should not change member state
            expect(pos.x).to.equal(member.initialState.x + 3);
            expect(pos.count).to.equal(3); 
        })

        it('from initial state, step off to the S', function() {
            var turnS = StepFactory.createStep(StrideType.SixToFive, StepType.Full, Direction.S);
            member.script[0] = turnS; // insert at count - 1
            var pos = MemberPositionCalculator.stepForward(member);
            expect(member.currentState.x).to.equal(member.initialState.x); // should not change state
            expect(pos.x).to.equal(member.initialState.x); // x should not change
            expect(pos.y).to.equal(member.initialState.y + 1); // y + 1, since S
        })

        it('from continue forward 3 steps S', function() {
            var turnS = StepFactory.createStep(StrideType.SixToFive, StepType.Full, Direction.S);
            member.script[0] = turnS; // insert at count - 1
            var pos = MemberPositionCalculator.stepForward(member);
            pos = MemberPositionCalculator.stepForward(member, pos);
            pos = MemberPositionCalculator.stepForward(member, pos);
            expect(member.currentState.x).to.equal(member.initialState.x); // should not change state
            expect(pos.x).to.equal(member.initialState.x); // x should not change
            expect(pos.y).to.equal(member.initialState.y + 3); // y + 3, since S
        })

        it('3 steps E, 3 steps S, 3 steps W, 3 steps N', function() {
            var turnS = StepFactory.createStep(StrideType.SixToFive, StepType.Full, Direction.S);
            var turnW = StepFactory.createStep(StrideType.SixToFive, StepType.Full, Direction.W);
            var turnN = StepFactory.createStep(StrideType.SixToFive, StepType.Full, Direction.N);

            member.script[3] = turnS; // insert at count - 1
            member.script[6] = turnW;
            member.script[9] = turnN;

            // basically a 3 step box, should end up back where we started

            var pos = MemberPositionCalculator.stepForward(member, null, 3);
            expect(member.currentState.x).to.equal(member.initialState.x); // should not change state
            expect(pos.x).to.equal(member.initialState.x + 3); 
            expect(pos.y).to.equal(member.initialState.y + 0); 
            
            pos = MemberPositionCalculator.stepForward(member, pos, 3);
            expect(member.currentState.x).to.equal(member.initialState.x); // should not change state
            expect(pos.x).to.equal(member.initialState.x + 3); 
            expect(pos.y).to.equal(member.initialState.y + 3); // y + 3, since S

            pos = MemberPositionCalculator.stepForward(member, pos, 3);
            expect(member.currentState.x).to.equal(member.initialState.x); // should not change state
            expect(pos.x).to.equal(member.initialState.x); 
            expect(pos.y).to.equal(member.initialState.y + 3); 
            
            pos = MemberPositionCalculator.stepForward(member, pos, 3);
            expect(member.currentState.x).to.equal(member.initialState.x); // should not change state
            expect(pos.x).to.equal(member.initialState.x); // back to where we started
            expect(pos.y).to.equal(member.initialState.y); 
        })

    })

    describe('stepBackward', function() {
        beforeEach(function() {
            // var step = StepFactory.createStep(StrideType.SixToFive, StepType.Full, Direction.E);
            // member.script.push(step);
            // member.currentState.count = 1;
            // member.currentState.x = 1;
        })

        it('should not change member state', function() {            
            var pos = MemberPositionCalculator.stepBackward(member);
            expect(member.currentState.x).to.equal(member.initialState.x); // should not change state
            expect(member.currentState.y).to.equal(member.initialState.y); // should not change state
            expect(member.currentState.direction).to.equal(member.initialState.direction);
            expect(member.currentState.count).to.equal(0); // should not change state
        })

        it('should step backward one step E', function() {
            // start at count 1, 1 count E
            member.currentState.count = 1;
            member.currentState.x = 1;
            
            var pos = MemberPositionCalculator.stepBackward(member);
            expect(pos.x).to.equal(member.initialState.x); 
        })

        it('should step backward 3 steps E', function() {
            // start at 3 counts E
            member.currentState.count = 3;
            member.currentState.x = 3;

            var pos = MemberPositionCalculator.stepBackward(member, null, 3);
            expect(pos.x).to.equal(member.initialState.x); 
        })

        it('rewind from 3 steps E, 3 steps W', function() {
            var turnW = StepFactory.createStep(StrideType.SixToFive, StepType.Full, Direction.W);

            member.script[3] = turnW;

            // step fwd 3
            var pos = MemberPositionCalculator.stepForward(member, null, 3);
            pos = MemberPositionCalculator.stepForward(member, pos, 3);
            
            pos = MemberPositionCalculator.stepBackward(member, pos, 3);
            expect(pos.x).to.equal(member.initialState.x + 3); 
            expect(pos.y).to.equal(member.initialState.y + 0); 

            pos = MemberPositionCalculator.stepBackward(member, pos, 3);
            expect(pos.x).to.equal(member.initialState.x + 0); 
            expect(pos.y).to.equal(member.initialState.y + 0); 
            
        })

        it('rewind from 3 steps E, 3 steps S, 3 steps W, 3 steps N', function() {
            var turnS = StepFactory.createStep(StrideType.SixToFive, StepType.Full, Direction.S);
            var turnW = StepFactory.createStep(StrideType.SixToFive, StepType.Full, Direction.W);
            var turnN = StepFactory.createStep(StrideType.SixToFive, StepType.Full, Direction.N);

            member.script[3] = turnS; // insert at count - 1
            member.script[6] = turnW;
            member.script[9] = turnN;

            var pos = MemberPositionCalculator.stepForward(member, null, 12);

            // basically a 3 step box, in reverse, should end up back where we started

            pos = MemberPositionCalculator.stepBackward(member, pos, 3);
            expect(pos.x).to.equal(member.initialState.x + 0); 
            expect(pos.y).to.equal(member.initialState.y + 3); 
            expect(pos.direction).to.equal(Direction.W); // should be back facing W

            pos = MemberPositionCalculator.stepBackward(member, pos, 3);
            expect(pos.x).to.equal(member.initialState.x + 3); 
            expect(pos.y).to.equal(member.initialState.y + 3); // y + 3, since S
            expect(pos.direction).to.equal(Direction.S); // should be back facing S
            
            pos = MemberPositionCalculator.stepBackward(member, pos, 3);
            expect(pos.x).to.equal(member.initialState.x + 3); 
            expect(pos.y).to.equal(member.initialState.y + 0); 
            expect(pos.direction).to.equal(Direction.E); // should be back facing E
            
            pos = MemberPositionCalculator.stepBackward(member, pos, 3);
            expect(pos.x).to.equal(member.initialState.x); // back to where we started
            expect(pos.y).to.equal(member.initialState.y); 
            expect(pos.direction).to.equal(member.initialState.direction); // should be back to initial (E)
        })
        
    })
    
    describe('goToBeginning', function() {
        beforeEach(function() {
            var step = StepFactory.createStep(StrideType.SixToFive, StepType.Full, Direction.E);
            member.script.push(step);
            member.currentState.count = 1;
            member.currentState.x = 1;
        })

        it('should return beginning position, without changing member state', function() {
            var pos = MemberPositionCalculator.stepBackward(member);
            expect(member.currentState.x).to.equal(1); // should not change state
            expect(member.currentState.count).to.equal(1); // should not change state
            expect(pos.x).to.equal(member.initialState.x); 
        })
    })

    describe('goToEnd', function() {
        beforeEach(function() {
            var step = StepFactory.createStep(StrideType.SixToFive, StepType.Full, Direction.E);
            member.script.push(step);
            // member.currentState.count = 1;
            // member.currentState.x = 1;
        })

        it('should go to end', function() {
            var pos = MemberPositionCalculator.goToEnd(member);
            expect(member.currentState.x).to.equal(0); // should not change state
            expect(member.currentState.count).to.equal(0); // should not change state
            expect(pos.x).to.equal(1);
        })
    })

    describe('goToCount', function() {
        beforeEach(function() {
            for (var i = 0; i < 6; i++) {
                let step = StepFactory.createStep(StrideType.SixToFive, StepType.Full, Direction.E);
                member.script.push(step);    
            }
        })

        it('should advance to step 3 when at 0', function() {
            var pos = member.currentState;
            pos = MemberPositionCalculator.goToCount(member, 3);

            expect(pos.x).to.equal(3); 
            expect(pos.count).to.equal(3); 
        })        

        it('should rewind to step 3 when at 6', function() {
            member.currentState.count = 6;
            member.currentState.x = 6;

            var pos = member.currentState;
            pos = MemberPositionCalculator.goToCount(member, 3);

            expect(pos.x).to.equal(3); 
            expect(pos.count).to.equal(3); 
        })        
    })

});
