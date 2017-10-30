import StrideType from '/client/lib/StrideType';
import StepType from '/client/lib/StepType';
import StepDelta from '/client/lib/StepDelta';
import Direction from '/client/lib/Direction';
import { FieldPoint, StepPoint } from '/client/lib/Point';

class GuidePath {
    constructor(file, initialPoint) {
        this.initialPoint = initialPoint;
        this.points = [initialPoint];
        this.file = file;
        this.startCount = file.leader.member.currentState.count;
    }

    get firstPoint() {
        return this.points[0];
    }

    get lastPoint() {
        return this.points[this.points.length - 1];
    }

    add(point) {
        var prevPoint = this.lastPoint;
        point.stepsFromPrevious = StepDelta.getStepsBetweenPoints(prevPoint.strideType || StrideType.SixToFive, prevPoint.stepType || StepType.Full, point, prevPoint);
        this.points.push(point);
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

    isInPath(point) {
        var sourcePoint = this.lastPoint;
        if (sourcePoint.direction == Direction.N && point.x == sourcePoint.x && point.y < sourcePoint.y)
            return true;

        if (sourcePoint.direction == Direction.E && point.y == sourcePoint.y && point.x > sourcePoint.x)
            return true;

        if (sourcePoint.direction == Direction.S && point.x == sourcePoint.x && point.y > sourcePoint.y)
            return true;

        if (sourcePoint.direction == Direction.W && point.y == sourcePoint.y && point.x < sourcePoint.x)
            return true;

        // TODO: obliques
        return null;
    }

    get pathExpr() {
        var pathExpr = "M ";
        this.points.forEach(sp => {
            let fp = new StepPoint(sp.strideType || StrideType.SixToFive, sp.x, sp.y).toFieldPoint();
            pathExpr += fp.x + ' ' + fp.y + ' L ';
        });
        return pathExpr.slice(0, -2);    
    }
}

export default GuidePath;
