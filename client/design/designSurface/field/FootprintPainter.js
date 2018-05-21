import Footprint from './Footprint';

class FootprintPainter {
  constructor(canvas) {
    this.canvas = canvas;
    this.footprints = [];
  }

  clear() {
    this.footprints.forEach((fp) => this.canvas.remove(fp));
    this.footprints = [];
  }

  paint(pointSet, options) {
    pointSet.points.forEach((p) => {
      options = Object.assign({ left: p.x, top: p.y }, options);
      const fp = new Footprint(options);
      fp.set('left', p.x);
      fp.set('top', p.y);
      this.footprints.push(fp);
      this.canvas.add(fp);
      // this.canvas.sendBackwards(fp); // SLOW
      // fp.moveTo(2); // SLOW!
      // this.canvas.bringToFront(fp); // SLOW
    });
  }
}

export default FootprintPainter;
