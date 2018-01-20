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
        let stepSize = FieldDimensions.getStepSize(strideType);
        let pathExpr = '';
        for (let i = 0; i < FieldDimensions.widthInSteps(strideType); i++) {
            let x = i * stepSize.x;
            pathExpr += `M ${x} 0 L ${x} ${FieldDimensions.height} `;
        }
        this.xLines = new fabric.Path(pathExpr, {
            fill: '',
            stroke: 'white',
            strokeWidth: 1,
            selectable: false,
            evented: false,
            opacity: .2,
        });
        canvas.add(this.xLines);
        this.xLines.sendToBack();
    }

    addYLines(canvas, strideType) {
        let stepSize = FieldDimensions.getStepSize(strideType);
        let pathExpr = '';
        for (let i = 0; i < FieldDimensions.heightInSteps(strideType); i++) {
            let y = (i * stepSize.y) - stepSize.yOffset; // - FieldDimensions.yOffset_8to5;
            pathExpr += `M 0 ${y} L ${FieldDimensions.width} ${y} `;
        }
        this.yLines = new fabric.Path(pathExpr, {
            fill: '',
            stroke: 'white',
            strokeWidth: 1,
            selectable: false,
            evented: false,
            opacity: .2,
        });
        canvas.add(this.yLines);
        this.yLines.sendToBack();
    }
}

export default GridPainter;
