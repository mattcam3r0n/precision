import FieldDimensions from '/client/lib/FieldDimensions';
import YardLinePainter from './YardLinePainter';

class FieldPainter {

    static paint(canvas) {
        YardLinePainter.paint(canvas);
        this.drawFieldLogo(canvas);
    }

    static drawFieldLogo(canvas) {
        var scaleFactor = .75;
        var self = this;
        var img = fabric.Image.fromURL('/field-logo.png', function(oImg) {
            oImg.scale(scaleFactor);
            oImg.selectable = false;
            oImg.evented = false;
            oImg.set('left', (FieldDimensions.width  / 2) - (oImg.width * scaleFactor / 2));
            oImg.set('top', (FieldDimensions.height / 2) - (oImg.height * scaleFactor / 2));
            oImg.set('opacity', .75);
            canvas.add(oImg);
        });
    }
}

export default FieldPainter;