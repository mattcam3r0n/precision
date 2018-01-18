'use strict';

import PivotPoint from './PivotPoint';
import PathArc from './PathArc';
import MarcherFactory from '../field/MarcherFactory';
import StrideType from '/client/lib/StrideType';
import PinwheelCalculator from './PinwheelCalculator';

class PinwheelIndicator {
    constructor(field, pivotMember, members, direction, rotation, counts) {
        this.field = field;
        this.pivotMember = pivotMember;
        this.members = members;
        this.pinwheelCalculator = new PinwheelCalculator(pivotMember, members);
        this.rotationDirection = direction;
        this.rotationAngle = rotation;
        this.counts = counts;

        this.create();
    }

    create() {
        this.steps = this.pinwheelCalculator
                            .calculateSteps(this.rotationDirection,
                                this.rotationAngle,
                                this.counts);
        this.createPivotMarker();
        this.createPathArc();
        this.createMarchers();
    }

    calculateMemberSteps() {

    }

    createPivotMarker() {
        this.pivotPointMarker = new PivotPoint(this.pivotMember.currentState);
        this.field.canvas.add(this.pivotPointMarker);
    }

    disposePivotMarker() {
        this.field.canvas.remove(this.pivotPointMarker);
    }

    createPathArc() {
        let info = this.pinwheelCalculator.getPathArcInfo();
        let startAngle;
        let endAngle;
        if (this.rotationDirection === 'counter-clockwise') {
            startAngle = info.angle - (this.rotationAngle * Math.PI);
            endAngle = info.angle;
        } else {
            startAngle = info.angle;
            endAngle = info.angle + (this.rotationAngle * Math.PI);
        }
        this.pathArc = new PathArc(this.pivotMember.currentState, info.distance, startAngle, endAngle); // eslint-disable-line max-len
        this.field.canvas.add(this.pathArc);
    }

    disposePathArc() {
        this.field.canvas.remove(this.pathArc);
    }

    createMarchers() {
        this.marchers = [];
        let endPositions = this.getEndPositions();
        endPositions.forEach((pos) => {
            let marcher = MarcherFactory
                .createMarcher(StrideType.SixToFive,
                    pos.x,
                    pos.y);
            marcher.left = pos.x;
            marcher.top = pos.y;
            this.marchers.push(marcher);
            this.field.canvas.add(marcher);
        });
    }

    getEndPositions() {
        return this.members.map((m) => {
            return {
                id: m.id,
                x: this.steps[m.id][this.counts - 1].x,
                y: this.steps[m.id][this.counts - 1].y,
            };
        });
    }

    dispose() {
        this.disposePivotMarker();
        this.disposePathArc();
        this.disposeMarchers();
    }

    disposeMarchers() {
        if (!this.marchers) return;
        this.marchers.forEach((m) => {
            this.field.canvas.remove(m);
        });
        this.marchers = null;
    }
}

export default PinwheelIndicator;
