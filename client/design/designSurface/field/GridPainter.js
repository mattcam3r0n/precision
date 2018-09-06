import FieldDimensions from '/client/lib/FieldDimensions';

class GridPainter {
    constructor(canvas, options) {
        this.canvas = canvas;
        this.options = Object.assign({
            gridColor: 'white',
            oddGridLinesOpacity: 0.4,
            evenGridLinesOpacity: 0.6,
        }, options);
    }

    dispose() {

    }

    showGrid(strideType) {
        this.removeGrid();

        this.addXLines(this.canvas, strideType);
        this.addYLines(this.canvas, strideType);
    }

    removeGrid() {
        this.canvas.remove(this.evenXLines);
        this.canvas.remove(this.oddXLines);
        this.canvas.remove(this.evenYLines);
        this.canvas.remove(this.oddYLines);
    }

    addXLines(canvas, strideType) {
        let stepSize = FieldDimensions.getStepSize(strideType);
        let evenPathsExpr = '';
        let oddPathsExpr = '';
        for (let i = 0; i < FieldDimensions.widthInSteps(strideType); i++) {
            const x = i * stepSize.x;
            const isEven = i % 2 == 0;
            if (isEven) {
                evenPathsExpr += `M ${x} 0 L ${x} ${FieldDimensions.height} `;
            } else {
                oddPathsExpr += `M ${x} 0 L ${x} ${FieldDimensions.height} `;
            }
        }
        this.evenXLines = new fabric.Path(evenPathsExpr, {
            fill: '',
            stroke: this.options.gridColor,
            strokeWidth: 1,
            selectable: false,
            evented: false,
            opacity: this.options.evenGridLinesOpacity,
        });
        this.oddXLines = new fabric.Path(oddPathsExpr, {
            fill: '',
            stroke: this.options.gridColor,
            strokeWidth: 1,
            selectable: false,
            evented: false,
            opacity: this.options.oddGridLinesOpacity,
        });
        canvas.add(this.evenXLines);
        canvas.add(this.oddXLines);
        this.evenXLines.sendToBack();
        this.oddXLines.sendToBack();
    }

    addYLines(canvas, strideType) {
        let stepSize = FieldDimensions.getStepSize(strideType);
        let evenPathExpr = '';
        let oddPathExpr = '';
        for (let i = 0; i < FieldDimensions.heightInSteps(strideType); i++) {
            let y = (i * stepSize.y) - stepSize.yOffset; // - FieldDimensions.yOffset_8to5;
            const isEven = i % 2 == 0;
            if (isEven) {
                evenPathExpr += `M 0 ${y} L ${FieldDimensions.width} ${y} `;
            } else {
                oddPathExpr += `M 0 ${y} L ${FieldDimensions.width} ${y} `;
            }
        }
        this.evenYLines = new fabric.Path(evenPathExpr, {
            fill: '',
            stroke: this.options.gridColor,
            strokeWidth: 1,
            selectable: false,
            evented: false,
            opacity: this.options.evenGridLinesOpacity,
        });
        this.oddYLines = new fabric.Path(oddPathExpr, {
            fill: '',
            stroke: this.options.gridColor,
            strokeWidth: 1,
            selectable: false,
            evented: false,
            opacity: this.options.oddGridLinesOpacity,
        });
        canvas.add(this.evenYLines);
        canvas.add(this.oddYLines);
        this.evenYLines.sendToBack();
        this.oddYLines.sendToBack();
    }
}

export default GridPainter;
