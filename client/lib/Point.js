import FieldDimensions from '/client/lib/FieldDimensions';
import Direction from '/client/lib/Direction';
import StrideType from '/client/lib/StrideType';
import StepType from '/client/lib/StepType';

class Point {
    constructor(x, y) {
        if (x.x && x.y)  { // x looks like an point object
            this.x = x.x;
            this.y = x.y;
        } else {
            this.x = x;
            this.y = y;
        }
    }

    static arePointsEqual(a, b) {
        return a.x == b.x && a.y == b.y;
    }

    equals(other) {
        return this.arePointsEqual(this, other);
    }

    difference(other) {
        return new Point(this.x - other.x, this.y - other.y);
    }

    add(other) {
        this.x += other.x;
        this.y += other.y;
    }
}

class FieldPoint extends Point {
    constructor(x, y) {
        super(x, y);
    }

    toStepPoint(strideType) {
        var stepPoint = FieldDimensions.toStepPoint(this, strideType);
        return new StepPoint(strideType, stepPoint.x, stepPoint.y);
    }
}

class StepPoint extends Point {
    constructor(strideType, x, y) {
        super(x, y);
        this.strideType = strideType;
    }

    toFieldPoint() {
        return FieldDimensions.toFieldPoint(this, this.strideType);
    }
}

export {
    Point,
    StepPoint,
    FieldPoint
}