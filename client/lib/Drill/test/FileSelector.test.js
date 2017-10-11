import { expect } from 'meteor/practicalmeteor:chai';

import FileSelector from '/client/lib/drill/FileSelector';

import StepFactory from '/client/lib/drill/StepFactory';
import Direction from '/client/lib/Direction';
import StrideType from '/client/lib/StrideType';
import StepType from '/client/lib/StepType';


describe('PositionMap', function () {

    var members;
    var fileSelector;

    beforeEach(function () {
        members = [
            {
                currentState: {
                    strideType: StrideType.SixToFive,
                    direction: Direction.E,
                    x: 0,
                    y: 0,
                    count: 0
                }
            },
            {
                currentState: {
                    strideType: StrideType.SixToFive,
                    direction: Direction.E,
                    x: 2,
                    y: 0,
                    count: 0
                }
            },
            {
                currentState: {
                    strideType: StrideType.SixToFive,
                    direction: Direction.E,
                    x: 4,
                    y: 0,
                    count: 0
                }
            },
            {
                currentState: {
                    strideType: StrideType.SixToFive,
                    direction: Direction.E,
                    x: 6,
                    y: 0,
                    count: 0
                }
            },

            {
                currentState: {
                    strideType: StrideType.SixToFive,
                    direction: Direction.E,
                    x: 0,
                    y: 2,
                    count: 0
                }
            },
            {
                currentState: {
                    strideType: StrideType.SixToFive,
                    direction: Direction.E,
                    x: 2,
                    y: 2,
                    count: 0
                }
            },
            {
                currentState: {
                    strideType: StrideType.SixToFive,
                    direction: Direction.E,
                    x: 4,
                    y: 2,
                    count: 0
                }
            },
            {
                currentState: {
                    strideType: StrideType.SixToFive,
                    direction: Direction.E,
                    x: 6,
                    y: 2,
                    count: 0
                }
            },
            {
                currentState: {
                    strideType: StrideType.SixToFive,
                    direction: Direction.E,
                    x: 0,
                    y: 4,
                    count: 0
                }
            },
            {
                currentState: {
                    strideType: StrideType.SixToFive,
                    direction: Direction.E,
                    x: 2,
                    y: 4,
                    count: 0
                }
            },
            {
                currentState: {
                    strideType: StrideType.SixToFive,
                    direction: Direction.E,
                    x: 4,
                    y: 4,
                    count: 0
                }
            },
            {
                currentState: {
                    strideType: StrideType.SixToFive,
                    direction: Direction.E,
                    x: 6,
                    y: 4,
                    count: 0
                }
            }
        ];
        fileSelector = new FileSelector(members);
    });

    describe('buildPositionMap', function () {
        it('should build the map, indexed by x and y', function () {
            expect(Object.keys(fileSelector.positionMap.map)).to.eql(['0', '2', '4', '6']);
            expect(Object.keys(fileSelector.positionMap.map[0])).to.eql(['0', '2', '4']);
        })
    })

})

describe('FileSelector', function () {

    var members;
    var fileSelector;

    beforeEach(function () {
        /**
         *  3 files, 4 ranks, in this configuration: 
         * 
         *    e e e e  
         *    E E E
         *    e e S
         *      s e
         */
        members = [
            { id: 1 , currentState: { x: 0, y: 0, direction: Direction.E, count: 8, strideType: StrideType.SixToFive} },
            { id: 2 , currentState: { x: 2, y: 0, direction: Direction.E, count: 8, strideType: StrideType.SixToFive} },
            { id: 3 , currentState: { x: 4, y: 0, direction: Direction.E, count: 8, strideType: StrideType.SixToFive} },
            { id: 4 , currentState: { x: 6, y: 0, direction: Direction.E, count: 8, strideType: StrideType.SixToFive} },
            { id: 5 , currentState: { x: 0, y: 2, direction: Direction.E, count: 8, strideType: StrideType.SixToFive} },
            { id: 6 , currentState: { x: 2, y: 2, direction: Direction.E, count: 8, strideType: StrideType.SixToFive} },
            { id: 7 , currentState: { x: 4, y: 2, direction: Direction.E, count: 8, strideType: StrideType.SixToFive} },
            { id: 8 , currentState: { x: 4, y: 4, direction: Direction.S, count: 8, strideType: StrideType.SixToFive} },
            { id: 9 , currentState: { x: 0, y: 4, direction: Direction.E, count: 8, strideType: StrideType.SixToFive} },
            { id: 10, currentState: { x: 2, y: 4, direction: Direction.E, count: 8, strideType: StrideType.SixToFive } },
            { id: 11, currentState: { x: 2, y: 6, direction: Direction.S, count: 8, strideType: StrideType.SixToFive } },
            { id: 12, currentState: { x: 4, y: 6, direction: Direction.E, count: 8, strideType: StrideType.SixToFive } }
        ];


        fileSelector = new FileSelector(members);
    });

    var files = null;

    describe('findFiles', function () {
        beforeEach(function() {
            files = fileSelector.findFiles();
        })

        it('should find 3 files', function() {
            expect(files.length).to.equal(3);
        })

        it('file 0 should be (6, 0), (4, 0), (2, 0), (0, 0)', function() {
            var file = files[0];
            var positions = file.fileMembers.map(fm => {
                return {
                    x: fm.member.currentState.x,
                    y: fm.member.currentState.y
                };
            });
            expect(positions).to.eql([{ x: 6, y: 0 },
                                      { x: 4, y: 0 },
                                      { x: 2, y: 0 },
                                      { x: 0, y: 0}
                                    ]);
        })

        it('file 1 should be (4, 4), (4, 2), (2, 2), (0, 2)', function() {
            var file = files[1];
            var positions = file.fileMembers.map(fm => {
                return {
                    x: fm.member.currentState.x,
                    y: fm.member.currentState.y
                };
            });
            expect(positions).to.eql([{ x: 4, y: 4 },
                                      { x: 4, y: 2 },
                                      { x: 2, y: 2 },
                                      { x: 0, y: 2 }
                                    ]);
        })

        it('file 2 should be (4, 6), (2, 6), (2, 4), (0, 4)', function() {
            var file = files[2];
            var positions = file.fileMembers.map(fm => {
                return {
                    x: fm.member.currentState.x,
                    y: fm.member.currentState.y
                };
            });
            expect(positions).to.eql([{ x: 4, y: 6 },
                                      { x: 2, y: 6 },
                                      { x: 2, y: 4 },
                                      { x: 0, y: 4 }
                                    ]);
        })

        it('file 0 should have 4 members', function() {
            expect(files[0].fileMembers.length).to.equal(4);
        })
    })

    describe('getFollowing', function () {

        it('member[1] at (2, 0) is following member[2] at (4, 0)', function () {
            var member = members[1]; // at (2,0)
            var following = fileSelector.getFollowing(member);
            expect({ x: following.currentState.x, y: following.currentState.y }).to.eql({ x: 4, y: 0 });
        })

        it('member[6] at (4, 2) is following member[7] at (4, 4)', function () {
            var member = members[6];
            var following = fileSelector.getFollowing(member);
            expect(following).to.equal(members[7], 'expected member[7]');
            expect({ x: following.currentState.x, y: following.currentState.y }).to.eql({ x: 4, y: 4 });
        })

        it('member[7] at (4, 4) is following no one', function () {
            var member = members[7];
            var following = fileSelector.getFollowing(member);
            expect(following).to.be.null;
        })

        it('member[11] at (4, 6) is following no one', function () {
            var member = members[11];
            var following = fileSelector.getFollowing(member);
            expect(following).to.be.null;
        })

        it('member[3] at (6, 0) is following no one', function () {
            var member = members[3];
            var following = fileSelector.getFollowing(member);
            expect(following).to.be.null;
        })

        it('member[10] at (2, 6) is following member[11] at (4, 6)', function () {
            var member = members[10];
            var following = fileSelector.getFollowing(member);
            expect(following).to.equal(members[11], 'expected member[11]');
        })
    })

    describe('getFollower', function () {
        it('member[3] at (6, 0) is followed by member[2] at (4, 0)', function () {
            var member = members[3];
            var follower = fileSelector.getFollower(member);
            expect({ x: follower.currentState.x, y: follower.currentState.y }).to.eql({ x: 4, y: 0 });
        })

        it('member[3] at (6, 0) is NOT followed by member[1] at (2, 0)', function () {
            var member = members[3];
            var follower = fileSelector.getFollower(member);
            expect({ x: follower.currentState.x, y: follower.currentState.y }).not.to.eql({ x: 2, y: 0 });
        })

        it('member[7] at (4, 4) is followed by member[6] at (4, 2)', function () {
            var member = members[7];
            var follower = fileSelector.getFollower(member);
            expect({ x: follower.currentState.x, y: follower.currentState.y }).to.eql({ x: 4, y: 2 });
        })

        it('member[10] at (2, 6) is followed by member[9] at (2, 4)', function () {
            var member = members[10];
            var follower = fileSelector.getFollower(member);
            expect({ x: follower.currentState.x, y: follower.currentState.y }).to.eql({ x: 2, y: 4 });
        })
    })

    describe('getRelativePosition', function () {

        it('should be 2 steps W of current position', function () {
            var pos = {
                x: 2,
                y: 0,
                strideType: StrideType.SixToFive,
                direction: Direction.E,
                count: 2
            };
            var relativePos = fileSelector.getRelativePosition(pos, Direction.W, 2);
            expect(relativePos.x).to.equal(0);
            expect(relativePos.y).to.equal(0);
        })

        it('should be 2 steps N of current position', function () {
            var pos = {
                x: 2,
                y: 2,
                strideType: StrideType.SixToFive,
                direction: Direction.E,
                count: 2
            };
            var relativePos = fileSelector.getRelativePosition(pos, Direction.N, 2);
            expect(relativePos.x).to.equal(2);
            expect(relativePos.y).to.equal(0);
        })

        it('should be 2 steps S of current position', function () {
            var pos = {
                x: 2,
                y: 0,
                strideType: StrideType.SixToFive,
                direction: Direction.E,
                count: 2
            };
            var relativePos = fileSelector.getRelativePosition(pos, Direction.S, 2);
            expect(relativePos.x).to.equal(2);
            expect(relativePos.y).to.equal(2);
        })

        it('should be 2 steps E of current position', function () {
            var pos = {
                x: 2,
                y: 0,
                strideType: StrideType.SixToFive,
                direction: Direction.E,
                count: 2
            };
            var relativePos = fileSelector.getRelativePosition(pos, Direction.E, 2);
            expect(relativePos.x).to.equal(4);
            expect(relativePos.y).to.equal(0);
        })

    })

});
