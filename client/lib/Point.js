import FieldDimensions from '/client/lib/FieldDimensions';

/** Represents a Point on the field */
class Point {
    /**
     * Constructor
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y) {
        // if x looks like a point object, initialize from it
        if (x.x && x.y) {
            this.x = x.x;
            this.y = x.y;
        } else {
            this.x = x;
            this.y = y;
        }
    }

    /**
     * Determine if two point are equal
     * @param {number} a
     * @param {number} b
     * @return {boolean}
     */
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
        let stepPoint = FieldDimensions.toStepPoint(this, strideType);
        return new StepPoint(strideType, stepPoint.x, stepPoint.y);
    }
}

class StepPoint extends Point {
    constructor(strideType, x, y) {
// console.log(x,y);

        let p = x.x ? {x: x.x, y: x.y} : {x, y};

        p = FieldDimensions.toStepPoint(p, strideType);


        super(p.x, p.y);
        this.strideType = strideType;
    }

    toFieldPoint() {
        let fieldPoint = FieldDimensions.toFieldPoint(this, this.strideType);
        return new FieldPoint(fieldPoint.x, fieldPoint.y);
    }

    isEvenPoint() {
        return this.x % 2 == 0 && this.y % 2 == 0;
    }

    isOddPoint() {
        return !this.isEvenPoint();
    }
}

export {
    Point,
    StepPoint,
    FieldPoint,
};
