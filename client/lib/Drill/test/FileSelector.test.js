import { expect } from 'meteor/practicalmeteor:chai';

import FileSelector from '/client/lib/drill/FileSelector';

import MemberPositionCalculator from '/client/lib/drill/MemberPositionCalculator';
import MemberPlayer from '/client/lib/drill/MemberPlayer';

import MemberFactory from '/client/lib/drill/MemberFactory';
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
         *    E E E E
         *    e e e e
         * 
         */
        var strideType = StrideType.SixToFive;
        var stepType = StepType.Full;
        var dir = Direction.E;
        members = [
            MemberFactory.createMember(strideType, dir, { x: 0, y: 0 }),
            MemberFactory.createMember(strideType, dir, { x: 2, y: 0 }),
            MemberFactory.createMember(strideType, dir, { x: 4, y: 0 }),
            MemberFactory.createMember(strideType, dir, { x: 6, y: 0 }),

            MemberFactory.createMember(strideType, dir, { x: 0, y: 2 }),
            MemberFactory.createMember(strideType, dir, { x: 2, y: 2 }),
            MemberFactory.createMember(strideType, dir, { x: 4, y: 2 }),
            MemberFactory.createMember(strideType, dir, { x: 6, y: 2 }),

            MemberFactory.createMember(strideType, dir, { x: 0, y: 4 }),
            MemberFactory.createMember(strideType, dir, { x: 2, y: 4 }),
            MemberFactory.createMember(strideType, dir, { x: 4, y: 4 }),
            MemberFactory.createMember(strideType, dir, { x: 6, y: 4 }),
        ];

        fileSelector = new FileSelector(members);
    });

    var files = null;

    describe('findFiles', function () {
        beforeEach(function () {
            files = fileSelector.findFiles();
        })

        it('should find 3 files', function () {
            expect(files.length).to.equal(3);
        })

        it('file 0 should be (6, 0), (4, 0), (2, 0), (0, 0)', function () {
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
            { x: 0, y: 0 }
            ]);
        })

        it('file 1 should be (6, 2), (4, 2), (2, 2), (0, 2)', function () {
            var file = files[1];
            var positions = file.fileMembers.map(fm => {
                return {
                    x: fm.member.currentState.x,
                    y: fm.member.currentState.y
                };
            });
            expect(positions).to.eql([{ x: 6, y: 2 },
            { x: 4, y: 2 },
            { x: 2, y: 2 },
            { x: 0, y: 2 }
            ]);
        })

        it('file 2 should be (6, 4), (4, 4), (4, 2), (4, 0)', function () {
            var file = files[2];
            var positions = file.fileMembers.map(fm => {
                return {
                    x: fm.member.currentState.x,
                    y: fm.member.currentState.y
                };
            });
            expect(positions).to.eql([{ x: 6, y: 4 },
            { x: 4, y: 4 },
            { x: 2, y: 4 },
            { x: 0, y: 4 }]);
        })

        it('file 0 should have 4 members', function () {
            expect(files[0].fileMembers.length).to.equal(4);
        })
    })

    describe('getFollowing', function () {

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

        })

        it('at count 0, member[0] should be following member[1]', function () {
            var following0 = fileSelector.getFollowing(members[0]);
            expect(following0.id).to.equal(members[1].id);
        })

        it('at count 0, member[1] should be following null', function () {
            var following = fileSelector.getFollowing(members[1]);
            expect(following).to.be.null;
        })

        it('at count 1, member[0] should be following member[1]', function () {
            MemberPlayer.stepForward(members[0]);
            MemberPlayer.stepForward(members[1]);
            fileSelector = new FileSelector(members);
            var following = fileSelector.getFollowing(members[0]);
            expect(following.id).to.equal(members[1].id);
        })

        it('at count 1, member[1] should be following null', function () {
            MemberPlayer.stepForward(members[0]);
            MemberPlayer.stepForward(members[1]);
            fileSelector = new FileSelector(members);
            var following = fileSelector.getFollowing(members[1]);
            expect(following).to.be.null;
        })

    })

    describe('getFollowedBy', function () {
        it('member[3] at (6, 0) is followed by member[2] at (4, 0)', function () {
            var member = members[3];
            var follower = fileSelector.getFollowedBy(member);
            expect({ x: follower.currentState.x, y: follower.currentState.y }).to.eql({ x: 4, y: 0 });
        })

        it('member[3] at (6, 0) is NOT followed by member[1] at (2, 0)', function () {
            var member = members[3];
            var follower = fileSelector.getFollowedBy(member);
            expect({ x: follower.currentState.x, y: follower.currentState.y }).not.to.eql({ x: 2, y: 0 });
        })

        it('member[7] at (4, 4) is followed by member[6] at (4, 2)', function () {
            var member = members[7];
            var follower = fileSelector.getFollowedBy(member);
            expect({ x: follower.currentState.x, y: follower.currentState.y }).to.eql({ x: 4, y: 2 });
        })

        it('member[10] at (2, 6) is followed by member[9] at (2, 4)', function () {
            var member = members[10];
            var follower = fileSelector.getFollowedBy(member);
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
