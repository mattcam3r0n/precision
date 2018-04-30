class PointSet {
  constructor() {
    this.pointMap = {};
  }

  key(point) {
      return point.x + ',' + point.y;
  }
  add(point) {
    this.pointMap[this.key(point)] = point;
  }

  clear() {
      this.pointMap = {};
  }

  delete(point) {
    delete this.pointMap[this.key(point)];
  }

  has(point) {
    this.pointMap[this.key(point)] ? true : false;
  }

  get points() {
    return Object.keys(this.pointMap).map((k) => {
        return this.pointMap[k];
    });
  }
}

export default PointSet;
