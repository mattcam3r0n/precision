import { expect } from 'meteor/practicalmeteor:chai';

import StepFactory from '/client/lib/drill/StepFactory';
import Direction from '/client/lib/Direction';
import StrideType from '/client/lib/StrideType';
import StepType from '/client/lib/StepType';

describe('StepFactory', function () {

    var step,
        strideType = StrideType.SixToFive,
        stepType = StepType.Full,
        direction = Direction.S;

    before(function() {
        step = StepFactory.createStep(strideType, stepType, direction);
    });

    it('should initialize strideType', function() {
        expect(step.strideType).to.equal(strideType);
    })

    it('should initialize stepType', function() {
        expect(step.stepType).to.equal(stepType);
    })

    it('should initialize direction', function() {
        expect(step.direction).to.equal(direction);
    })

    it('should initialize deltaX and deltaY when provided', function() {
        step = StepFactory.createStep(strideType, stepType, direction, 0.25, 0.50);
        expect(step.deltaX).to.equal(0.25);
        expect(step.deltaY).to.equal(0.5);
    })

});
