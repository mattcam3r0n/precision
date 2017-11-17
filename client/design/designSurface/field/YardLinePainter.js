import FieldDimensions from '/client/lib/FieldDimensions';

class YardLinePainter {
    static paint(canvas) {
        addSideLines(canvas);
        addYardLines(canvas);
        addYardLineNumbers(canvas);
        addHashMarks(canvas);
    }
}

var _yardlineMarkers = [ "G    ", "1 0", "2 0", "3 0", "4 0", "5 0", "4 0", "3 0", "2 0", "1 0", "    G" ];

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
        evented: false,
        opacity: .75
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
                evented: false,
                opacity: .75
            });
        canvas.add(line);    
        line.sendToBack();
      }    
}

function addHashMarks(canvas) {
    var lineOptions = {
        fill: 'white',
        stroke: 'white',
        strokeWidth: 2,
        selectable: false,
        evented: false,
        opacity: .75
    };
	for(var i = 0; i < 21; i++) {
        var x = FieldDimensions.goallineX + (i * FieldDimensions.fiveYardsX);
        var farHashCoords = [x - 10, FieldDimensions.farHashY, x + 10, FieldDimensions.farHashY];
        var nearHashCoords = [x - 10, FieldDimensions.nearHashY, x + 10, FieldDimensions.nearHashY];
        var farHash = new fabric.Line(farHashCoords, lineOptions);
        var nearHash = new fabric.Line(nearHashCoords, lineOptions);
        canvas.add(farHash);    
        canvas.add(nearHash);    
        farHash.sendToBack();
        nearHash.sendToBack();
      }        
}

function addYardLineNumbers(canvas) {

    let textOptions = {
        fontSize: 24,
        lineHeight: 1,
        originX: 'center',
        originY: 'center',
        fontFamily: 'Helvetica',
        fontWeight: 'bold',
        stroke: 'white',
        fill: 'white',
        opacity: .75,
        statefullCache: true,
        selectable: false,
        evented: false
      };

    var farY = FieldDimensions.farSidelineY + FieldDimensions.fiveYardsY;
    var nearY = FieldDimensions.nearSidelineY - FieldDimensions.fiveYardsY;
    
    for (var i = 0; i < _yardlineMarkers.length; i++) {
        let x = FieldDimensions.goallineX + (i * FieldDimensions.fiveYardsX * 2);
        var farText = new fabric.Text(_yardlineMarkers[i], Object.assign({ left: x, top: farY }, textOptions));
        var nearText = new fabric.Text(_yardlineMarkers[i], Object.assign({ left: x, top: nearY }, textOptions));
        canvas.add(farText);
        canvas.add(nearText);
        farText.sendToBack();    
        nearText.sendToBack();    
    }

}

export default YardLinePainter;