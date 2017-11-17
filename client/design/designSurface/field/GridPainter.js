import FieldDimensions from '/client/lib/FieldDimensions';

class GridPainter {
    constructor(canvas) {
        this.canvas = canvas;
    }

    dispose() {

    }

    showGrid(strideType) {
        this.removeGrid();

        this.addXLines(this.canvas, strideType);
        this.addYLines(this.canvas, strideType);
    }

    removeGrid() {
        this.canvas.remove(this.xLines);
        this.canvas.remove(this.yLines);
    }

    addXLines(canvas, strideType) {
        var stepSize = FieldDimensions.getStepSize(strideType);
        var pathExpr = "";
        for(var i = 0; i < FieldDimensions.widthInSteps(strideType); i++) {
            var x = i * stepSize.x;
            var coords = [x, 0, x, FieldDimensions.height];
            pathExpr += `M ${x} 0 L ${x} ${FieldDimensions.height} `;
        }
        this.xLines = new fabric.Path(pathExpr, {
            fill: 'white',
            stroke: 'white',
            strokeWidth: 1,
            selectable: false,
            evented: false,
            opacity: .3
        });
        canvas.add(this.xLines);
        this.xLines.sendToBack();
    }

    addYLines(canvas, strideType) {
        var stepSize = FieldDimensions.getStepSize(strideType);
        var pathExpr = "";
        for(var i = 0; i < FieldDimensions.heightInSteps(strideType); i++) {
            var y = (i * stepSize.y) - stepSize.yOffset; // - FieldDimensions.yOffset_8to5;
            var coords = [y, 0, y, FieldDimensions.width];
            pathExpr += `M 0 ${y} L ${FieldDimensions.width} ${y} `;
        }
        this.yLines = new fabric.Path(pathExpr, {
            fill: 'white',
            stroke: 'white',
            strokeWidth: 1,
            selectable: false,
            evented: false,
            opacity: .3
        });
        canvas.add(this.yLines);
        this.yLines.sendToBack();
    }
}

export default GridPainter;