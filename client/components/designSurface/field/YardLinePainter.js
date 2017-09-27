import StepDelta from '/client/lib/StepDelta';
import FieldDimensions from '/client/lib/FieldDimensions';

class YardLinePainter {
    static paint(canvas) {
        addSideLines(canvas);
        addYardLines(canvas);
    }
}

function addSideLines(canvas) {
    var sidelineRect = FieldDimensions.sidelineRect;
    var rect = new fabric.Rect({
        left: sidelineRect.left,
        top: sidelineRect.top,
        width: sidelineRect.width,
        height: sidelineRect.height,
        fill: 'rgba(0,0,0,0)',
        selectable: false,
        stroke: 'white',
        strokeWidth: 3,
        evented: false
    });
    canvas.add(rect);
    rect.sendToBack();
}

function addYardLines(canvas) {
	for(var i = 0; i < 21; i++) {
        var x = FieldDimensions.goallineX + (i * FieldDimensions.fiveYardsX);
        var coords = [x, FieldDimensions.farSidelineY, x, FieldDimensions.farSidelineY + FieldDimensions.height - (2 * FieldDimensions.fiveYardsY)];
        var line = new fabric.Line(coords, {
                fill: 'white',
                stroke: 'white',
                strokeWidth: 2,
                selectable: false,
                evented: false
            });
        canvas.add(line);    
        line.sendToBack();
      }    
}

export default YardLinePainter;