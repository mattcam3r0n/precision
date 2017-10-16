import { expect } from 'meteor/practicalmeteor:chai';

import DrillPlayer from '/client/lib/drill/DrillPlayer';

import StepFactory from '/client/lib/drill/StepFactory';
import Direction from '/client/lib/Direction';
import StrideType from '/client/lib/StrideType';
import StepType from '/client/lib/StepType';

describe('DrillPlayer', function () {

    var drill;
    var dillPlayer;

    beforeEach(function() {
        drill = {
            count: 0,
            members: [
                {
                    initialState: {
                        strideType: StrideType.SixToFive,
                        stepType: StepType.Full,
                        direction: Direction.E,
                        deltaX: 1,
                        deltaY: 0,
                        x: 0,
                        y: 0
                    },
                    currentState: {
                        strideType: StrideType.SixToFive,
                        stepType: StepType.Full,
                        direction: Direction.E,
                        deltaX: 1,
                        deltaY: 0,
                        x: 0,
                        y: 0,
                        count: 0
                    },
                    script: [
                        {
                            strideType: StrideType.SixToFive,
                            stepType: StepType.Full,
                            direction: Direction.E,
                            deltaX: 1,
                            deltaY: 0
                        }
                    ]
                },
                {
                    initialState: {
                        strideType: StrideType.SixToFive,
                        stepType: StepType.Full,
                        direction: Direction.E,
                        deltaX: 1,
                        deltaY: 0,
                        x: 0,
                        y: 0
                    },
                    currentState: {
                        strideType: StrideType.SixToFive,
                        stepType: StepType.Full,
                        direction: Direction.E,
                        deltaX: 1,
                        deltaY: 0,
                        x: 0,
                        y: 0,
                        count: 0                       
                    },
                    script: [
                        {
                            strideType: StrideType.SixToFive,
                            stepType: StepType.Full,
                            direction: Direction.E,
                            deltaX: 1,
                            deltaY: 0
                        },
                        {
                            strideType: StrideType.SixToFive,
                            stepType: StepType.Full,
                            direction: Direction.E,
                            deltaX: 1,
                            deltaY: 0
                        }
                    ]
                }
            ]
        };
        drillPlayer = new DrillPlayer(drill);
    });

    describe('isBeginningOfDrill', function(){
        it('should return true when at beginning of drill', function() {
            expect(drillPlayer.isBeginningOfDrill()).to.be.true;
        })
    
        it('should return false when not at beginning of drill', function() {
            // move one member to a non-zero count
            drill.members[1].currentState.count = 1;
            expect(drillPlayer.isBeginningOfDrill()).to.be.false;
        })
    })

    describe('isEndOfDrill', function(){
        it('should return false when at beginning of drill', function() {
            expect(drillPlayer.isEndOfDrill()).to.be.false;
        })
    
        it('should return true when all members are at end of drill', function() {
            drill.members.forEach(m => {
                m.currentState.count = 2;
            });
            expect(drillPlayer.isEndOfDrill()).to.be.true;
        })
    })

    describe('goToBeginning', function() {
        it('should set count to 0', function() {
            drill.count = 2;
            drill.members[0].currentState.count = 2;
            drill.members[1].currentState.count = 2;
            drillPlayer.goToBeginning();
            expect(drill.count).to.equal(0);
        })

        it('should set all members to initial state', function(){
            drill.members[0].currentState.count = 2;
            drill.members[1].currentState.count = 2;
            
            drillPlayer.goToBeginning();

            expect(drill.members[0].currentState.x).to.equal(0);        
            expect(drill.members[0].currentState.y).to.equal(0);
            expect(drill.members[0].currentState.count).to.equal(0);    

            expect(drill.members[1].currentState.x).to.equal(0);        
            expect(drill.members[1].currentState.y).to.equal(0);
            expect(drill.members[1].currentState.count).to.equal(0);    
        })
    })

    describe('goToEnd', function() {
        it('should set all members to count 2', function() {
            
            drillPlayer.goToEnd();
            
            expect(drill.count).to.equal(2);
            expect(drill.members[0].currentState.count).to.equal(2);
            expect(drill.members[1].currentState.count).to.equal(2);            
        })
    })

    describe('stepForward', function() {
        it('should increment drill count', function() {
            expect(drill.count).to.equal(0);
            drillPlayer.stepForward();
            expect(drill.count).to.equal(1);
            drillPlayer.stepForward();
            //expect(drill.count).to.equal(2);
        })
    })

    describe('stepBackward', function() {
        it('should decrement drill count', function() {
            drill.count = 2;
            drill.members.forEach(m => {
                m.currentState.count = 2;
            });
            expect(drill.count).to.equal(2);
            drillPlayer.stepBackward();
            expect(drill.count).to.equal(1);
            drillPlayer.stepBackward();
            expect(drill.count).to.equal(0);            
        })
    })

});
