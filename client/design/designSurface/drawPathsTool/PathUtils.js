import Direction from '/client/lib/Direction';
import FieldDimensions from '/client/lib/FieldDimensions';
import StepType from '/client/lib/StepType';
import StepDelta from '/client/lib/StepDelta';

var inPathFuncs = {
    [Direction.N]: isInPathN,
    [Direction.S]: isInPathS,
    [Direction.E]: isInPathE,
    [Direction.W]: isInPathW,
    [Direction.NE]: isInPathNE,
    [Direction.SE]: isInPathSE,
    [Direction.SW]: isInPathSW,
    [Direction.NW]: isInPathNW
    // TODO: obliques
};

var snapPointFuncs = {
    [Direction.N]: snapPointN,
    [Direction.S]: snapPointS,
    [Direction.E]: snapPointE,
    [Direction.W]: snapPointW,
    [Direction.NE]: snapPointNE,
    [Direction.SE]: snapPointSE,
    [Direction.SW]: snapPointSW,
    [Direction.NW]: snapPointNW
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

function snapPointNE(strideType, srcPoint, point) {
    point.x = FieldDimensions.snapObliqueX(strideType, point.x);
    var p = calculatePointOnLine(srcPoint, srcPoint.direction, point.x);
    point.x = p.x;
    point.y = p.y;
    return point;
}

function snapPointSE(strideType, srcPoint, point) {
    point.x = FieldDimensions.snapObliqueX(strideType, point.x);
    var p = calculatePointOnLine(srcPoint, srcPoint.direction, point.x);
    point.x = p.x;
    point.y = p.y;
    return point;
}

function snapPointSW(strideType, srcPoint, point) {
    point.x = FieldDimensions.snapObliqueX(strideType, point.x);
    var p = calculatePointOnLine(srcPoint, srcPoint.direction, point.x);
    point.x = p.x;
    point.y = p.y;
    return point;
}

function snapPointNW(strideType, srcPoint, point) {
    point.x = FieldDimensions.snapObliqueX(strideType, point.x);
    var p = calculatePointOnLine(srcPoint, srcPoint.direction, point.x);
    point.x = p.x;
    point.y = p.y;
    return point;
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

function isInPathNE(strideType, srcPoint, point) {
    var stepSize = FieldDimensions.getStepSize(strideType);
    var p = calculatePointOnLine(srcPoint, srcPoint.direction, point.x);
    var deltaX = p.x - point.x; // point should be less than srcPoint
    var deltaY = Math.abs(p.y - point.y); 
    return (point.x >= srcPoint.x && deltaX <= stepSize.x / 2 && deltaY <= stepSize.y / 2);
}

function isInPathSE(strideType, srcPoint, point) {
    var stepSize = FieldDimensions.getStepSize(strideType);
    var p = calculatePointOnLine(srcPoint, srcPoint.direction, point.x);
    var deltaX = p.x - point.x; // x should be greatern than srcPoint
    var deltaY = Math.abs(p.y - point.y); 
    return (point.x >= srcPoint.x && deltaX <= stepSize.x / 2 && deltaY <= stepSize.y / 2);
}

function isInPathSW(strideType, srcPoint, point) {
    var stepSize = FieldDimensions.getStepSize(strideType);
    var p = calculatePointOnLine(srcPoint, srcPoint.direction, point.x);
    var deltaX = p.x - point.x; // x should be less than srcPoint
    var deltaY = Math.abs(p.y - point.y); 
    return (point.x <= srcPoint.x && deltaX <= stepSize.x / 2 && deltaY <= stepSize.y / 2);
}

function isInPathNW(strideType, srcPoint, point) {
    var stepSize = FieldDimensions.getStepSize(strideType);
    var p = calculatePointOnLine(srcPoint, srcPoint.direction, point.x);
    var deltaX = p.x - point.x; // point should be less than srcPoint
    var deltaY = Math.abs(p.y - point.y); 
    return (point.x <= srcPoint.x && deltaX <= stepSize.x / 2 && deltaY <= stepSize.y / 2);
}

function yIntercept(point, slope) {
    return point.y - (slope * point.x); // b = y - mx
}

function isOnLine(knownPoint, knownSlope, testPoint) {
    var b = this.yIntercept(knownPoint, knownSlope);
    return testPoint.y.toFixed(3) == ((knownSlope * testPoint.x) + b).toFixed(3); // y = mx + b
}

function calculatePointOnLine(startPoint, direction, x) {
    var m = Direction.getSlope(direction);
    var b = yIntercept(startPoint, m);
    var y = m * x + b;
    return {
        x: x,
        y: y
    };
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
