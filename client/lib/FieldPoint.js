
class FieldPoint {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static arePointsEqual(a, b) {
        return a.x == b.x && a.y == b.y;
    }

    equals(other) {
        return this.x == other.x && this.y == other.y;
    }
}

export default FieldPoint;