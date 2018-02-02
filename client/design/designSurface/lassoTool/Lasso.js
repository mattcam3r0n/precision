/* Notes

- make lasso managed mouse move and click events, but only when active
- have activate/deactivate methods
- field controller has one lasso instance, always there but not always active
- activate on event or shift+click
- double click to close/complete lasso
    or when clicking a hotzone near start?
- escape key should cancel lasso
- delete key should remove last point
- how to handle keys?
   keyboard handler broadcasts event?
   lasso tool would need event service to catch, or field controller would catch and call lasso?
- isInPolygon method on lasso?
- who tests marchers to see who's in polygon?
   notify lasso selection event?
   prob just have field controller do it, like it does for current selection
*/
class Lasso {
    constructor(field) {
        this.field = field;
        this.origin = origin;
        this.points = [];
        this.isActive = false;

        this.dblClickHandler = this.onDoubleClick.bind(this);
        this.clickHandler = this.onClick.bind(this);
        this.moveHandler = this.onMove.bind(this);

        this.field.canvas.on('mouse:up', this.clickHandler);
        this.field.canvas.on('mouse:move', this.moveHandler);
        fabric.util.addListener(this.field.canvas.upperCanvasEl, 'dblclick', this.dblClickHandler);
    }

    dispose() {
        destroyPath();
        destroyGuideline();
        fabric.util.removeListener(this.field.canvas.upperCanvasEl, 'dblclick', this.dblClickHandler);
        this.field.canvas.off('mouse:up', this.clickHandler);
    }

    onDoubleClick(evt) {
        const point = this.field.adjustMousePoint({
            x: evt.layerX,
            y: evt.layerY,
        });
        if (!this.isActive) {
            this.startLasso(point);
        } else {
            this.endLasso(point);
        }
    }

    onClick(evt) {
        if (!this.isActive) return;
        const point = this.field.adjustMousePoint({
            x: evt.e.layerX,
            y: evt.e.layerY,
        });
        const lastPoint = this.points[this.points.length - 1];
        if (!(lastPoint.x == point.x && lastPoint.y == point.y)) {
            this.addPoint(point);
        }
    }

    onMove(evt) {
        if (!this.isActive) return;
        const point = this.field.adjustMousePoint({
            x: evt.e.layerX,
            y: evt.e.layerY,
        });
        this.drawGuideline(point);
    }

    startLasso(point) {
        this.isActive = true;
        this.points = [point];
    }

    endLasso(point) {
        const firstPoint = this.points[0];
        this.points.push(firstPoint);

        const marchers = Object.values(this.field.marchers);
        const selectedMembers = marchers.filter((m) => {
            return this.isPointInside({ x: m.left, y: m.top});
        }).map((m) => m.member);

        this.field.notifyObjectsSelected({
            members: selectedMembers,
        });

        this.isActive = false;
        this.points = [];
        this.destroyPath();
        this.destroyGuideline();
        this.field.update();
    }

    drawGuideline(point) {
        this.destroyGuideline();
        const lastPoint = this.points[this.points.length - 1];
        this.guideline = new fabric.Line([lastPoint.x, lastPoint.y,
            point.x, point.y], {
            stroke: 'black',
            strokeDashArray: [3, 3],
            selectable: false,
            evented: false,
        });
        this.field.canvas.add(this.guideline);
    }

    destroyGuideline() {
        this.field.canvas.remove(this.guideline);
    }

    addPoint(point) {
        this.points.push(point);
        this.createPath();
    }

    createPath() {
        if (this.lassoPath) {
            this.destroyPath();
        }
        this.lassoPath = new fabric.Path(this.getPathExpr(), {
            stroke: 'black',
            strokeDashArray: [3, 3],
            fill: 'wheat',
            opacity: .5,
            evented: false,
            selectable: false,
        });
        this.field.canvas.add(this.lassoPath);
        this.field.update();
    }

    getPathExpr() {
        let pathExpr = 'M ';
        this.points.forEach((p) => {
            pathExpr += p.x + ' ' + p.y + ' L ';
        });
        return pathExpr.slice(0, -2);
    }

    destroyPath() {
        this.field.canvas.remove(this.lassoPath);
        this.lassoPath = null;
    }

    // From https://stackoverflow.com/questions/22521982/js-check-if-point-inside-a-polygon
    isPointInside(point) {
        // ray-casting algorithm based on
        // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

        const x = point.x;
        const y = point.y;

        const vs = this.points.map((p) => [p.x, p.y]);

        let inside = false;
        for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
            let xi = vs[i][0];
            let yi = vs[i][1];
            let xj = vs[j][0];
            let yj = vs[j][1];

            let intersect = ((yi > y) != (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }

        return inside;
    };
}

export default Lasso;
