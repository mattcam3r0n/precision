class Path {
    constructor(initialPoint) {
        this.points = [initialPoint];
    }

    add(point) {
        this.points.push(point);
    }

    get lastPoint() {
        return this.points[this.points.length - 1];
    }
}

export default Path;
