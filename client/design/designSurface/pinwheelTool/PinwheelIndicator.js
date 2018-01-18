'use strict';

import PivotPoint from './PivotPoint';
import PathArc from './PathArc';
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
        let info = this.pinwheelCalculator
                    .getPathArcInfo(this.rotationDirection,
                                    this.rotationAngle);
        this.pathArc = new PathArc(info);
        this.field.canvas.add(this.pathArc);
    }

    disposePathArc() {
        this.field.canvas.remove(this.pathArc);
    }

    createMarchers() {
        this.marchers = [];
        let endPositions = this.getEndPositions();
        endPositions.forEach((pos) => {
            let marcher = this.createMarcher(pos.x, pos.y);
            this.marchers.push(marcher);
            this.field.canvas.add(marcher);
        });
    }

    createMarcher(x, y) {
        let marcher = new fabric.Triangle({
            originX: 'center',
            originY: 'center',
            left: x,
            top: y,
            height: 15,
            width: 15,
            fill: 'black',
            opacity: .25,
        });
        return marcher;
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
