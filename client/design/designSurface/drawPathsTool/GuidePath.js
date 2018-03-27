import StrideType from '/client/lib/StrideType';
import StepType from '/client/lib/StepType';
import StepDelta from '/client/lib/StepDelta';
import Direction from '/client/lib/Direction';
import { StepPoint } from '/client/lib/Point';
import TurnMarker from '../field/TurnMarker';
import CounterMarch from '../field/CounterMarch';
import PathUtils from './PathUtils';
import ScriptSequence from '/client/lib/drill/ScriptSequence';

class GuidePath {
    constructor(field, file, initialPoint, strideType) {
        this.field = field;
        this.initialPoint = {
            strideType: strideType, // reflect current stride type
            stepType: StepType.Full,
            direction: initialPoint.direction,
            x: initialPoint.x,
            y: initialPoint.y,
        };
        this.strideType = strideType;
        this.points = [this.initialPoint];
        this.file = file;
        this.startCount = file.leader.member.currentState.count;

        this.onMouseMoveHandler = this.onMouseMove.bind(this);
        // this.field.canvas.on('mouse:move', this.onMouseMoveHandler);
    }

    setCurrentTurnDirection(dir) {
        this.currentDir = dir;
    }

    get firstPoint() {
        return this.points[0];
    }

    get lastPoint() {
        return this.points[this.points.length - 1];
    }

    findPoint(point) {
        let foundPoint = this.points.find((p) => {
            return p.x == point.x && p.y == point.y;
        });
        return foundPoint;
    }

    findPrecedingPoint(point) {
        let i = this.points.indexOf(point);
        return this.points[i - 1];
    }

    // return newPoint if it is a valid point, orig if not
    movePoint(origPoint, newPoint) {
        // var p = this.findPoint(origPoint);
        // if (!p)
        //     return this.resetMarkerPoint(p.turnMarker, p);

        let prevPoint = this.findPrecedingPoint(origPoint);
        if (!this.isInPath(newPoint, prevPoint)) {
            return this.resetMarkerPoint(origPoint.turnMarker, origPoint);
        }

        let delta = {
            deltaX: newPoint.x - origPoint.x,
            deltaY: newPoint.y - origPoint.y,
        };

        // adjust point and those that follow it
        for (let i = this.points.indexOf(origPoint); i < this.points.length; i++) { // eslint-disable-line max-len
            let p2 = this.points[i];
            p2.x = p2.x + delta.deltaX;
            p2.y = p2.y + delta.deltaY;

            let newFp = new StepPoint(p2.strideType, p2.x, p2.y).toFieldPoint();
            this.setMarkerPoint(p2.turnMarker, newFp);
        }
    }

    resetMarkerPoint(marker, point) {
        if (!marker) return;
        let fp = new StepPoint(point.strideType, point.x, point.y)
            .toFieldPoint();
        this.setMarkerPoint(marker, fp);
    }

    setMarkerPoint(marker, fieldPoint) {
        if (!marker) return;

        marker.set('left', fieldPoint.x);
        marker.set('top', fieldPoint.y);
        marker.setCoords();
    }

    getScriptSequence() {
        const seq = new ScriptSequence();
        this.points.forEach((p, i) => {
            const countsToSkip = p.stepsFromPrevious - 1 || 0;
            if (countsToSkip) {
                seq.addNull(countsToSkip);
            }
            seq.addStep(p);
        });
        return seq;
    }

    add(point) {
        let snappedPoint = PathUtils.snapPoint(this.strideType,
            this.lastPoint, point);
        if (snappedPoint.direction === Direction.CM) {
            this.addCountermarch(snappedPoint);
            return;
        }
        snappedPoint.stepsFromPrevious = this
            .calculateStepsFromPreviousPoint(snappedPoint);
        this.createTurnMarker(snappedPoint);
        this.points.push(snappedPoint);
        this.createGuidePathLine();
    }

    isLeftTurn(stepPoint) {
        return this.getEndCount(stepPoint) % 2 == 0 ? true : false;
    }

    addCountermarch(point) {
        let stepPoint = new StepPoint(point.strideType, point.x, point.y);
        let isLeftTurn = this.isLeftTurn(stepPoint);

        let currentDir = this.lastPoint.direction;
        let firstTurnDirection = isLeftTurn
            ? Direction.leftOf(currentDir)
            : Direction.rightOf(currentDir);
        let secondTurnDirection = isLeftTurn
            ? Direction.leftOf(firstTurnDirection)
            : Direction.rightOf(firstTurnDirection);
        let firstDelta = StepDelta.getDelta(this.strideType,
            StepType.Half, firstTurnDirection, 2);

        let fp = stepPoint.toFieldPoint();
        let tm = new CounterMarch(currentDir, isLeftTurn, {
            left: fp.x,
            top: fp.y,
        });
        this.field.canvas.add(tm);

        let point1 = {
            x: stepPoint.x,
            y: stepPoint.y,
            direction: firstTurnDirection,
            strideType: this.strideType,
            stepType: StepType.Half,
            turnMarker: tm,
        };
        point1.stepsFromPrevious = this.calculateStepsFromPreviousPoint(point1);
        this.points.push(point1);

//        let secondDelta = StepDelta.getDelta(this.strideType, StepType.Full, secondTurnDirection, 1);

        let point2 = {
            x: stepPoint.x + firstDelta.deltaX,
            y: stepPoint.y + firstDelta.deltaY,
            direction: secondTurnDirection,
            strideType: this.strideType,
            stepType: StepType.Full,
            stepsFromPrevious: 2,
            // turnMarker: tm  // deliberately don't reference tm here, interferes with moving
        };
        this.points.push(point2);
        tm.point = point1;
        tm.point1 = point1;
        tm.point2 = point2;

        tm.on('moving', (evt) => {
            this.onMoveTurnMarker(evt, this.field, this, point, tm);
        });

        this.createGuidePathLine();
    }

    calculateStepsFromPreviousPoint(point) {
        let prevPoint = this.lastPoint;
        return StepDelta.getStepsBetweenPoints(this.strideType
            || StrideType.SixToFive, prevPoint.stepType
            || StepType.Full, prevPoint.direction, point, prevPoint);
    }

    createTurnMarker(point) {
        point.turnMarker = new TurnMarker(point.direction, {
            left: point.x,
            top: point.y,
        });
        point.turnMarker.point = point;
        point.turnMarker.on('moving', (evt) => {
            this.onMoveTurnMarker(evt, this.field, this,
                point, point.turnMarker);
            this.turnMarkerMoving = true;
        });
        point.turnMarker.on('modified', (evt) => {
            this.turnMarkerMoving = false;
        });
        this.field.canvas.add(point.turnMarker);
    }

    removeTurnMarker(marker) {
        if (marker.type == 'CounterMarch') {
            return this.removeCounterMarch(marker);
        }

        this.removePoint(marker.point);
        this.field.canvas.remove(marker);
        this.createGuidePathLine();
    }

    removeCounterMarch(marker) {
        // remove references to turn marker
        marker.point.turnMarker = null;
        marker.point1.turnMarker = null;
        marker.point2.turnMarker = null;

        this.removePoint(marker.point1);
        this.removePoint(marker.point2);

        this.field.canvas.remove(marker);
        this.createGuidePathLine();
    }

    removePoint(p) {
        let pIndex = this.points.indexOf(p);
        if (pIndex < 0) return;

        // get delta between point being removed and following point
        let nextPoint = pIndex < this.points.length - 1
            ? this.points[pIndex + 1]
            : { x: 0, y: 0 };
        let delta = {
            deltaX: p.x - nextPoint.x,
            deltaY: p.y - nextPoint.y,
        };

        // adjust point and those that follow it
        for (let i = pIndex + 1; i < this.points.length; i++) {
            let p2 = this.points[i];

            p2.x = p2.x + delta.deltaX;
            p2.y = p2.y + delta.deltaY;

            let newFp = new StepPoint(p2.strideType, p2.x, p2.y).toFieldPoint();
            this.setMarkerPoint(p2.turnMarker, newFp);
        }

        p.turnMarker = null;
        this.points.splice(pIndex, 1);
    }

    bringTurnMarkersToFront() {
        this.points.forEach((p) => {
            this.field.canvas.bringToFront(p.turnMarker);
        });
    }


    onMouseMove(evt) {
        if ( this.turnMarkerMoving) return;
        let adjustedPoint = this.field.adjustMousePoint({
            x: evt.e.layerX,
            y: evt.e.layerY,
        });
        // var stepPoint = new FieldPoint(adjustedPoint).toStepPoint(this.strideType);
this.shiftKey = evt.e.shiftKey;
        if (this.isInPath(adjustedPoint)) {
            let snappedPoint = PathUtils.snapPoint(this.strideType,
                this.lastPoint, adjustedPoint);
//            snappedPoint.steps = this.calculateStepsFromPreviousPoint(snappedPoint);
            this.createGuideline(this.lastPoint, snappedPoint);

            if (this.currentDir == Direction.CM) {
                if (this.isLeftTurn(snappedPoint)) {
                    this.field.canvas.defaultCursor = 'url(/icons/CM-left.svg) 8 8, auto';
                } else {
                    this.field.canvas.defaultCursor = 'url(/icons/CM-right.svg) 8 8, auto';
                }
            }
        } else {
            this.destroyGuideline();
            this.destroyMoveStepsLabel();
        }
    }

    onMoveTurnMarker(evt, field, guidePath, point, turnMarker) {
        let adjustedMousePoint = field.adjustMousePoint({
            x: evt.e.layerX,
            y: evt.e.layerY,
        });
        let precedingPoint = this.findPrecedingPoint(turnMarker.point);
        let snappedPoint = PathUtils.snapPoint(this.strideType,
            precedingPoint, adjustedMousePoint);
        // let moveToStepPoint = new FieldPoint(adjustedMousePoint).toStepPoint(this.strideType);

        // this.setGuidelineLabel('foo');
        // this.createGuideline(precedingPoint, moveToStepPoint);
        this.createMoveStepsLabel(precedingPoint, snappedPoint);

        guidePath.movePoint(turnMarker.point, snappedPoint);

        this.createGuidePathLine();
    }

    createGuidePathLine() {
        this.destroyGuidePathLine();
        this.path = new fabric.Path(this.pathExpr, {
            stroke: 'black',
            strokeWidth: 2,
            strokeDashArray: [3, 3],
            fill: false,
            selectable: false,
            evented: false,
        });
        this.field.canvas.add(this.path);
        this.bringTurnMarkersToFront();
        this.field.update();
    }

    destroyGuidePathLine() {
        this.field.canvas.remove(this.path);
        this.path = null;
        this.field.update();
    }

    createGuideline(from, to) {
        this.destroyGuideline();

        this.guideline = new fabric.Line([from.x, from.y, to.x, to.y], {
            stroke: 'black',
            strokeWidth: 2,
            strokeDashArray: [2, 2],
            selectable: false,
            evented: false,
        });

        let steps = to.steps || 0;

        function formatSteps(x) {
            if (x == 0) return '';
            return x.toFixed(1).replace(/\.0$/, '');
        }

        this.guidelineLabel = new fabric.Text(formatSteps(steps), {
            left: to.x + 10,
            top: to.y + 0,
            fontSize: 16,
            stroke: 'white',
//            fontWeight: 'bold',
//            lineHeight: 1,
            selectable: false,
            evented: false,
          });

        this.field.canvas.add(this.guideline);
        this.field.canvas.add(this.guidelineLabel);
        this.bringTurnMarkersToFront();
    }

    setGuidelineLabel(text) {
        if (!this.guidelineLabel) return;
        this.guidelineLabel.setText(text);
    }

    createMoveStepsLabel(from, to) {
        this.destroyMoveStepsLabel();
        let steps = (to.steps || 0).toString();
        this.moveStepsLabel = new fabric.Text(steps, {
            left: to.x + 10,
            top: to.y + 10,
            fontSize: 20,
            stroke: 'black',
//            fontWeight: 'bold',
//            lineHeight: 1,
            selectable: false,
            evented: false,
          });

        this.field.canvas.add(this.moveStepsLabel);
    }

    destroyMoveStepsLabel() {
        if (!this.moveStepsLabel) return;
        this.field.canvas.remove(this.moveStepsLabel);
    }

    destroyGuideline() {
        if (!this.guideline) return;
        this.field.canvas.remove(this.guidelineLabel);
        this.field.canvas.remove(this.guideline);
        this.guideline = null;
        this.guidelineLabel = null;
        this.field.update();
    }

    getEndCount(stepPoint) {
        if (!stepPoint) {
            return this.startCount + this.getLengthInCounts();
        }

        let steps = StepDelta.getStepsBetweenPoints(this.strideType,
            stepPoint.stepType, this.lastPoint.direction,
            this.lastPoint, stepPoint);

        return this.startCount + this.getLengthInCounts() + steps;
    }

    getLengthInCounts() {
        let counts = 0;
        if (this.points.length < 2) {
            return 0;
        }
        for (let i = 0; i < this.points.length - 1; i++) {
            let a = this.points[i];
            let b = this.points[i + 1];
            counts += StepDelta.getStepsBetweenPoints(this.strideType,
                a.stepType, a.direction, a, b);
        }
        return counts;
    }

    isInPath(point, sourcePoint) {
        sourcePoint = sourcePoint || this.lastPoint;

        return PathUtils.isInPath(this.strideType, sourcePoint, point);
    }

    // Move these to a line utils class?
    yIntercept(point, slope) {
        return point.y - (slope * point.x); // b = y - mx
    }

    isOnLine(knownPoint, knownSlope, testPoint) {
        let b = this.yIntercept(knownPoint, knownSlope);
        return testPoint.y.toFixed(3) == ((knownSlope * testPoint.x) + b)
            .toFixed(3); // y = mx + b
    }

    get pathExpr() {
        let pathExpr = 'M ';
        this.points.forEach((sp) => {
            // let fp = new StepPoint(sp.strideType || StrideType.SixToFive, sp.x, sp.y).toFieldPoint();
            pathExpr += sp.x + ' ' + sp.y + ' L ';
        });
        return pathExpr.slice(0, -2);
    }

    dispose() {
        this.field.canvas.off('mouse:move', this.onMouseMoveHandler);
        this.destroyGuideline();
        this.destroyGuidePathLine();
        this.points.forEach((p) => {
            this.field.canvas.remove(p.turnMarker);
            p.turnMarker = null;
        });
    }
}

export default GuidePath;
