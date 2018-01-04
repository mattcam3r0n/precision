import FieldDimensions from '/client/lib/FieldDimensions';
import YardLinePainter from './YardLinePainter';
import GridPainter from './GridPainter';

class FieldPainter {

    constructor(canvas) {
        this.canvas = canvas;
        this.gridPainter = new GridPainter(canvas);
        this.strideType = 0;
    }

    dispose() {
        this.canvas.remove(this.logo);

    }

    paint() {
        YardLinePainter.paint(this.canvas);
        this.showGrid(this.strideType);
        this.drawFieldLogo(this.canvas);
        this.canvas.renderAll();
    }

    drawFieldLogo() {
        var scaleFactor = .75;
        var self = this;
        self.logo = fabric.Image.fromURL('/field-logo.png', function(oImg) {
            oImg.scale(scaleFactor);
            oImg.selectable = false;
            oImg.evented = true;
            oImg.set('left', (FieldDimensions.width  / 2) - (oImg.width * scaleFactor / 2));
            oImg.set('top', (FieldDimensions.height / 2) - (oImg.height * scaleFactor / 2));
            oImg.set('opacity', .75);
            self.canvas.add(oImg);

            oImg.on('mouseover', function() {
                oImg.set('opacity', .25);
                oImg.sendToBack();
            });

            oImg.on('mouseout', function() {
                oImg.set('opacity', .75);
                oImg.sendToBack();
            });
        });
    }

    showGrid(strideType) {
        this.strideType = strideType;
        this.gridPainter.showGrid(strideType);
    }

    hideGrid() {
        this.gridPainter.removeGrid();
    }
}

export default FieldPainter;