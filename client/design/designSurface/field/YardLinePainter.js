import FieldDimensions from '/client/lib/FieldDimensions';

class YardLinePainter {
    static paint(canvas) {
        addSideLines(canvas);
        addYardLines(canvas);
        addYardLineNumbers(canvas);
        addHashMarks(canvas);
    }
}

let _opacity = .7;
let _yardlineMarkers = ['G    ', '1 0', '2 0', '3 0', '4 0', '5 0', '4 0', '3 0', '2 0', '1 0', '    G'];

function addSideLines(canvas) {
    let sidelineRect = FieldDimensions.sidelineRect;
    let rect = new fabric.Rect({
        left: sidelineRect.left,
        top: sidelineRect.top,
        width: sidelineRect.width,
        height: sidelineRect.height,
        fill: 'rgba(0,0,0,0)',
        selectable: false,
        stroke: 'white',
        strokeWidth: 3,
        evented: false,
        opacity: _opacity,
    });
    canvas.add(rect);
    rect.sendToBack();
}

function addYardLines(canvas) {
    for (let i = 0; i < 21; i++) {
        let x = FieldDimensions.goallineX + (i * FieldDimensions.fiveYardsX);
        let coords = [x, FieldDimensions.farSidelineY, x,
            FieldDimensions.farSidelineY
            + FieldDimensions.height
            - (2 * FieldDimensions.fiveYardsY)];
        let line = new fabric.Line(coords, {
                fill: 'white',
                stroke: 'white',
                strokeWidth: 2,
                selectable: false,
                evented: false,
                opacity: _opacity,
            });
        canvas.add(line);
        line.sendToBack();
      }
}

function addHashMarks(canvas) {
    let lineOptions = {
        fill: 'white',
        stroke: 'white',
        strokeWidth: 2,
        selectable: false,
        evented: false,
        opacity: _opacity,
    };
    for (let i = 0; i < 21; i++) {
        let x = FieldDimensions.goallineX + (i * FieldDimensions.fiveYardsX);
        let farHashCoords = [x - 10, FieldDimensions.farHashY,
            x + 10, FieldDimensions.farHashY];
        let nearHashCoords = [x - 10, FieldDimensions.nearHashY,
            x + 10, FieldDimensions.nearHashY];
        let farHash = new fabric.Line(farHashCoords, lineOptions);
        let nearHash = new fabric.Line(nearHashCoords, lineOptions);
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
        opacity: _opacity,
        statefullCache: true,
        selectable: false,
        evented: false,
      };

    let farY = FieldDimensions.farSidelineY + FieldDimensions.fiveYardsY;
    let nearY = FieldDimensions.nearSidelineY - FieldDimensions.fiveYardsY;

    for (let i = 0; i < _yardlineMarkers.length; i++) {
        let x = FieldDimensions.goallineX
            + (i * FieldDimensions.fiveYardsX * 2);
        let farText = new fabric.Text(_yardlineMarkers[i],
            Object.assign({ left: x, top: farY }, textOptions));
        let nearText = new fabric.Text(_yardlineMarkers[i],
            Object.assign({ left: x, top: nearY }, textOptions));
        canvas.add(farText);
        canvas.add(nearText);
        farText.sendToBack();
        nearText.sendToBack();
    }
}

export default YardLinePainter;
