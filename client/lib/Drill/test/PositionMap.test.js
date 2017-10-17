import { expect } from 'meteor/practicalmeteor:chai';

import PositionMap from '/client/lib/drill/PositionMap';
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
    });

    describe('buildPositionMap', function () {
        it('should build the X map, indexed by x and y', function () {
            var map = new PositionMap(members);
            expect(Object.keys(map.xMap)).to.eql(['0', '2', '4', '6']);
            expect(Object.keys(map.xMap[0])).to.eql(['0', '2', '4']);
        })

        it('should build the Y map, indexed by y and x', function () {
            var map = new PositionMap(members);
            expect(Object.keys(map.yMap)).to.eql(['0', '2', '4']);
            expect(Object.keys(map.yMap[0])).to.eql(['0', '2', '4', '6']);
        })
    })

})

