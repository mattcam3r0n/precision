import StrideType from '/client/lib/StrideType';
import StepType from '/client/lib/StepType';
import StepDelta from '/client/lib/StepDelta';
import Direction from '/client/lib/Direction';
import { FieldPoint, StepPoint } from '/client/lib/Point';
import TurnMarker from '../field/TurnMarker';
import CounterMarch from '../field/CounterMarch';

class GuidePath {
    constructor(field, file, initialPoint, strideType) {
        this.field = field;
        this.initialPoint = initialPoint;
        this.strideType = strideType;
        this.points = [initialPoint];
        this.file = file;
        this.startCount = file.leader.member.currentState.count;

        this.onMouseMoveHandler = this.onMouseMove.bind(this);
        this.field.canvas.on('mouse:move', this.onMouseMoveHandler);

console.log(this);
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
        var foundPoint = this.points.find(p => {
            return p.x == point.x && p.y == point.y;
        });
        return foundPoint;
    }

    findPrecedingPoint(point) {
        var i = this.points.indexOf(point);
        return this.points[i - 1];
    }

    // return newPoint if it is a valid point, orig if not
    movePoint(origPoint, newPoint) {
        // var p = this.findPoint(origPoint);
        // if (!p) 
        //     return this.resetMarkerPoint(p.turnMarker, p);

        var prevPoint = this.findPrecedingPoint(origPoint);
        if (!this.isInPath(newPoint, prevPoint))
            return this.resetMarkerPoint(origPoint.turnMarker, origPoint);
        
        var delta = {
            deltaX: newPoint.x - origPoint.x,
            deltaY: newPoint.y - origPoint.y
        };

        // adjust point and those that follow it
        for (var i = this.points.indexOf(origPoint); i < this.points.length; i++) {
            let p2 = this.points[i];
            p2.x = p2.x + delta.deltaX;
            p2.y = p2.y + delta.deltaY;

            var newFp = new StepPoint(p2.strideType, p2.x, p2.y).toFieldPoint();
            this.setMarkerPoint(p2.turnMarker, newFp);
        }
    }

    resetMarkerPoint(marker, point) {
        if (!marker) return;
        var fp = new StepPoint(point.strideType, point.x, point.y).toFieldPoint();
        this.setMarkerPoint(marker, fp);
    }

    setMarkerPoint(marker, fieldPoint) {
        if (!marker) return;

        marker.set('left', fieldPoint.x);
        marker.set('top', fieldPoint.y);
        marker.setCoords();
    }

    add(point) {
        if (point.direction === Direction.CM) {
            this.addCountermarch(point);
            return;
        }

        point.stepsFromPrevious = this.calculateStepsFromPreviousPoint(point);
        this.createTurnMarker(point);
        this.points.push(point);
        this.createGuidePathLine();
    }

    isLeftTurn(stepPoint) {
        return this.getEndCount(stepPoint) % 2 == 0 ? true : false;        
    }

    addCountermarch(point) {
        var stepPoint = new StepPoint(point.strideType, point.x, point.y);
        var isLeftTurn = this.isLeftTurn(stepPoint);

        var currentDir = this.lastPoint.direction;
        var firstTurnDirection = isLeftTurn ? Direction.leftTurnDirection(currentDir) : Direction.rightTurnDirection(currentDir);
        var secondTurnDirection = isLeftTurn ? Direction.leftTurnDirection(firstTurnDirection) : Direction.rightTurnDirection(firstTurnDirection);
        var firstDelta = StepDelta.getDelta(this.strideType, StepType.Half, firstTurnDirection, 2);

        var fp = stepPoint.toFieldPoint();
        var tm = new CounterMarch(currentDir, isLeftTurn, {
            left: fp.x,
            top: fp.y
        });
        this.field.canvas.add(tm);

        var point1 = {
            x: stepPoint.x,
            y: stepPoint.y,
            direction: firstTurnDirection,
            strideType: this.strideType,
            stepType: StepType.Half,
            turnMarker: tm
        };
        point1.stepsFromPrevious = this.calculateStepsFromPreviousPoint(point1);
        this.points.push(point1);

        var secondDelta = StepDelta.getDelta(this.strideType, StepType.Full, secondTurnDirection, 1);

        var point2 = {
            x: stepPoint.x + firstDelta.deltaX,
            y: stepPoint.y + firstDelta.deltaY,
            direction: secondTurnDirection,
            strideType: this.strideType,
            stepType: StepType.Full,
            stepsFromPrevious: 2
            //turnMarker: tm  // deliberately don't reference tm here, interferes with moving
        };
        this.points.push(point2);
        tm.point = point1;
        tm.point1 = point1;
        tm.point2 = point2;

        tm.on('moving', evt => { this.onMoveTurnMarker(evt, this.field, this, point, tm); });
        
        this.createGuidePathLine();
    }

    calculateStepsFromPreviousPoint(point) {
        var prevPoint = this.lastPoint;
        return StepDelta.getStepsBetweenPoints(prevPoint.strideType || StrideType.SixToFive, prevPoint.stepType || StepType.Full, point, prevPoint);
    }

    createTurnMarker(point) {
        var stepPoint = new StepPoint(point.strideType, point.x, point.y);
        var fieldPoint = stepPoint.toFieldPoint();
        point.turnMarker = new TurnMarker(point.direction, {
            left: fieldPoint.x,
            top: fieldPoint.y
        });
        point.turnMarker.point = point;
        point.turnMarker.on('moving', evt => { this.onMoveTurnMarker(evt, this.field, this, point, point.turnMarker); });
        this.field.canvas.add(point.turnMarker);
    }

    removeTurnMarker(marker) {
        if(marker.type == 'CounterMarch') {
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
        var pIndex = this.points.indexOf(p);
        if (pIndex < 0) return;

        // get delta between point being removed and following point
        var nextPoint = pIndex < this.points.length - 1 ? this.points[pIndex + 1] : { x: 0, y: 0 };
        var delta = {
            deltaX: p.x - nextPoint.x,
            deltaY: p.y - nextPoint.y
        };

        // adjust point and those that follow it
        for (var i = pIndex + 1; i < this.points.length; i++) {
            let p2 = this.points[i];
            
            p2.x = p2.x + delta.deltaX;
            p2.y = p2.y + delta.deltaY;

            var newFp = new StepPoint(p2.strideType, p2.x, p2.y).toFieldPoint();
            this.setMarkerPoint(p2.turnMarker, newFp);
        }

        p.turnMarker = null;
        this.points.splice(pIndex, 1);
    }

    bringTurnMarkersToFront() {
        this.points.forEach(p => {
            this.field.canvas.bringToFront(p.turnMarker);
        });
    }


    onMouseMove(evt) {
        var adjustedPoint = this.field.adjustMousePoint({ x: evt.e.layerX, y: evt.e.layerY });
        var stepPoint = new FieldPoint(adjustedPoint).toStepPoint(this.strideType);

        if (this.isInPath(stepPoint)) {
console.log('isInPath');
            this.createGuideline(this.lastPoint, stepPoint);
            
            if (this.currentDir == Direction.CM) {
                if (this.isLeftTurn(stepPoint)) {
                    this.field.canvas.defaultCursor = "url(/icons/CM-left.svg) 16 16, auto";
                } else {
                    this.field.canvas.defaultCursor = "url(/icons/CM-right.svg) 16 16, auto";
                }
            }
        } else {
            this.destroyGuideline();
        }
    }

    onMoveTurnMarker(evt, field, guidePath, point, turnMarker) {
        let adjustedMousePoint = field.adjustMousePoint({ x: evt.e.layerX, y: evt.e.layerY });
        let moveToStepPoint = new FieldPoint(adjustedMousePoint).toStepPoint(this.strideType);

        guidePath.movePoint(turnMarker.point, moveToStepPoint);

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
            evented: false
        });
        this.field.canvas.add(this.path);
        this.bringTurnMarkersToFront();
    }

    destroyGuidePathLine() {
        this.field.canvas.remove(this.path);
        this.path = null;
    }

    createGuideline(fromStepPoint, toStepPoint) {
        this.destroyGuideline();

        var from = new StepPoint(this.strideType, fromStepPoint).toFieldPoint(),
            to = new StepPoint(this.strideType, toStepPoint).toFieldPoint();

        this.guideline = new fabric.Line([from.x, from.y, to.x, to.y], {
            stroke: 'black',
            strokeWidth: 2,
            strokeDashArray: [2, 2],
            selectable: false,
            evented: false
        });
        this.field.canvas.add(this.guideline);
        this.bringTurnMarkersToFront();
    }

    destroyGuideline() {
        if (!this.guideline) return;

        this.field.canvas.remove(this.guideline);
        this.guideline = null;
    }

    getEndCount(stepPoint) {
        if (!stepPoint)
            return this.startCount + this.getLengthInCounts();

        var steps = StepDelta.getStepsBetweenPoints(stepPoint.strideType, stepPoint.stepType, this.lastPoint, stepPoint);

        return this.startCount + this.getLengthInCounts() + steps;
    }

    getLengthInCounts() {
        var counts = 0;
        if (this.points.length < 2)
            return 0;
        for (var i = 0; i < this.points.length - 1; i++) {
            let a = this.points[i];
            let b = this.points[i + 1];
            counts += StepDelta.getStepsBetweenPoints(a.strideType, a.stepType, a, b);
        }
        return counts;
    }

    getStepsFromLastPoint(stepPoint) {
        return StepDelta.getStepsBetweenPoints(this.lastPoint, stepPoint);
    }

    isInPath(point, sourcePoint) {
        var sourcePoint = sourcePoint || this.lastPoint;
console.log(point, sourcePoint);
        if (sourcePoint.direction == Direction.N && point.x == sourcePoint.x && point.y < sourcePoint.y)
            return true;

        if (sourcePoint.direction == Direction.E && point.y == sourcePoint.y && point.x > sourcePoint.x)
            return true;

        if (sourcePoint.direction == Direction.S && point.x == sourcePoint.x && point.y > sourcePoint.y)
            return true;

        if (sourcePoint.direction == Direction.W && point.y == sourcePoint.y && point.x < sourcePoint.x)
            return true;

        // obliques
        if (sourcePoint.direction == Direction.NE && this.isOnLine(sourcePoint, -1, point) && point.y < sourcePoint.y)
            return true;

        if (sourcePoint.direction == Direction.SE && this.isOnLine(sourcePoint, 1, point) && point.y > sourcePoint.y)
            return true;

        if (sourcePoint.direction == Direction.SW && this.isOnLine(sourcePoint, -1, point) && point.y > sourcePoint.y)
            return true;

        if (sourcePoint.direction == Direction.NW && this.isOnLine(sourcePoint, 1, point) && point.y < sourcePoint.y)
            return true;

        return null;
    }

    // Move these to a line utils class?
    yIntercept(point, slope) {
        return point.y - (slope * point.x); // b = y - mx
    }

    isOnLine(knownPoint, knownSlope, testPoint) {
        var b = this.yIntercept(knownPoint, knownSlope);
        return testPoint.y == (knownSlope * testPoint.x) + b; // y = mx + b
    }

    get pathExpr() {
        var pathExpr = "M ";
        this.points.forEach(sp => {
            let fp = new StepPoint(sp.strideType || StrideType.SixToFive, sp.x, sp.y).toFieldPoint();
            pathExpr += fp.x + ' ' + fp.y + ' L ';
        });
        return pathExpr.slice(0, -2);
    }

    dispose() {
        this.field.canvas.off('mouse:move', this.onMouseMoveHandler);
        this.destroyGuideline();
        this.destroyGuidePathLine();
        this.points.forEach(p => {
            this.field.canvas.remove(p.turnMarker);
            p.turnMarker = null;
        });
    }
}

export default GuidePath;
