import StepDelta from '/client/lib/StepDelta';
import FieldDimensions from '/client/lib/FieldDimensions';

class YardLinePainter {
    static paint(canvas) {
        addSideLines(canvas);
        addYardLines(canvas);
        addYardLineNumbers(canvas);
    }
}

var _yardLines = [ "G    ", "1 0", "2 0", "3 0", "4 0", "5 0", "4 0", "3 0", "2 0", "1 0", "    G" ];

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

function addYardLineNumbers(canvas) {

    let x = FieldDimensions.goallineX;

    for (var i = 0; i < _yardLines.length; i++) {
        var farText = new fabric.Text(_yardLines[i], {
            fontSize: 24,
            left: x + (i * FieldDimensions.fiveYardsX * 2),
            top: FieldDimensions.farSidelineY + 35,
            lineHeight: 1,
            originX: 'center',
            fontFamily: 'Helvetica',
            fontWeight: 'bold',
            stroke: 'lightgray',
            fill: 'lightgray',
            statefullCache: true,
            selectable: false,
            evented: false
          });
        var nearText = new fabric.Text(_yardLines[i], {
            fontSize: 24,
            left: x + (i * FieldDimensions.fiveYardsX * 2),
            top: FieldDimensions.nearSidelineY,
            lineHeight: 1,
            originX: 'center',
            fontFamily: 'Helvetica',
            fontWeight: 'bold',
            stroke: 'lightgray',
            fill: 'lightgray',
            statefullCache: true,
            selectable: false,
            evented: false
          });
        canvas.add(farText);
        canvas.add(nearText);
        farText.sendToBack();    
        nearText.sendToBack();    
    }

}

export default YardLinePainter;