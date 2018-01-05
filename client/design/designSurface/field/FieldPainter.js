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
        self.logo = fabric.Image.fromURL('/field-logo.png', function(img) {
            img.scale(scaleFactor);
            img.selectable = false;
            img.evented = true;
            img.set('left', (FieldDimensions.width  / 2) - (img.width * scaleFactor / 2));
            img.set('top', (FieldDimensions.height / 2) - (img.height * scaleFactor / 2));
            img.set('opacity', .75);
            img.hoverCursor = 'default';
            self.canvas.add(img);

            img.on('mouseover', function() {
                img.set('opacity', .25);
                img.sendToBack();
            });

            img.on('mouseout', function() {
                img.set('opacity', .75);
                img.sendToBack();
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