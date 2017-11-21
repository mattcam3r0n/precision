import Direction from '/client/lib/Direction';
import FieldDimensions from '/client/lib/FieldDimensions';
import StepType from '/client/lib/StepType';
import StepDelta from '/client/lib/StepDelta';

var inPathFuncs = {
    [Direction.N]: isInPathN,
    [Direction.S]: isInPathS,
    [Direction.E]: isInPathE,
    [Direction.W]: isInPathW
    // TODO: obliques
};

var snapPointFuncs = {
    [Direction.N]: snapPointN,
    [Direction.S]: snapPointS,
    [Direction.E]: snapPointE,
    [Direction.W]: snapPointW
    // TODO: obliques
};

function snapPointN(strideType, srcPoint, point) {
    var stepSize = FieldDimensions.getStepSize(strideType);
    var p = Object.assign({}, point);
    p.x = srcPoint.x;
    p.y = FieldDimensions.snapY(strideType, point.y);
    return p;
}

function snapPointS(strideType, srcPoint, point) {
    var stepSize = FieldDimensions.getStepSize(strideType);
    var p = Object.assign({}, point);
    p.x = srcPoint.x;
    p.y = FieldDimensions.snapY(strideType, point.y);
    return p;
}

function snapPointE(strideType, srcPoint, point) {
    var stepSize = FieldDimensions.getStepSize(strideType);
    var p = Object.assign({}, point);
    p.x = FieldDimensions.snapX(strideType, point.x);
    p.y = srcPoint.y;
    return p;
}

function snapPointW(strideType, srcPoint, point) {
    var stepSize = FieldDimensions.getStepSize(strideType);
    var p = Object.assign({}, point);
    p.x = FieldDimensions.snapX(strideType, point.x);
    p.y = srcPoint.y;
    return p;
}

function isInPathN(strideType, srcPoint, point) {
    var stepSize = FieldDimensions.getStepSize(strideType);
    var deltaX = Math.abs(srcPoint.x - point.x);
    var deltaY = srcPoint.y - point.y; // point should less than srcPoint
    return (deltaY >= 0 && deltaX <= stepSize.x / 2);
}

function isInPathS(strideType, srcPoint, point) {
    var stepSize = FieldDimensions.getStepSize(strideType);
    var deltaX = Math.abs(point.x - srcPoint.x);
    var deltaY = point.y - srcPoint.y; // point should be greater than srcPoint
    return (deltaY >= 0 && deltaX <= stepSize.x / 2);
}

function isInPathE(strideType, srcPoint, point) {
    var stepSize = FieldDimensions.getStepSize(strideType);
    var deltaX = point.x - srcPoint.x; // point should be greater than srcPoint
    var deltaY = Math.abs(point.y - srcPoint.y);
    return (deltaX >= 0 && deltaY <= stepSize.y / 2);
}

function isInPathW(strideType, srcPoint, point) {
    var stepSize = FieldDimensions.getStepSize(strideType);
    var deltaX = srcPoint.x - point.x; // point should be less than srcPoint
    var deltaY = Math.abs(srcPoint.y - point.y); 
    return (deltaX >= 0 && deltaY <= stepSize.y / 2);
}

class PathUtils {
    static isInPath(strideType, srcPoint, point) {
        if (srcPoint.direction == null || srcPoint.direction === undefined) return false;
        return inPathFuncs[srcPoint.direction](strideType, srcPoint, point);
    }

    static snapPoint(strideType, srcPoint, point) {
        if (srcPoint.direction == null || srcPoint.direction === undefined) return false;
        var snappedPoint = snapPointFuncs[srcPoint.direction](strideType, srcPoint, point);        
        snappedPoint.steps = StepDelta.getStepsBetweenPoints(strideType, srcPoint.stepType || StepType.Full, srcPoint.direction, snappedPoint, srcPoint);
        
        return snappedPoint;
    }

}

export default PathUtils;
