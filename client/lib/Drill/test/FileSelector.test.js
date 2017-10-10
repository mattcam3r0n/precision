import { expect } from 'meteor/practicalmeteor:chai';

import FileSelector from '/client/lib/drill/FileSelector';

// import StepFactory from '/client/lib/drill/StepFactory';
// import Direction from '/client/lib/Direction';
// import StrideType from '/client/lib/StrideType';
// import StepType from '/client/lib/StepType';

describe('FileSelector', function () {

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
        //fileSelector = new FileSelector(members);
    });

    // describe('buildPositionMap', function () {
    //     it('should build the map', function () {
    //         console.log(fileSelector);
    //         var map = fileSelector.buildPositionMap();
    //         console.log(map);
    //     })

    //     it('should return false when not at beginning of drill', function () {
    //         // move one member to a non-zero count
    //         // drill.members[1].currentState.count = 1;
    //         // expect(drillPlayer.isBeginningOfDrill()).to.be.false;
    //     })
    // })


});
