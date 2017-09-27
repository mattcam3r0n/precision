import FieldDimensions from '/client/lib/FieldDimensions';
import YardLinePainter from './YardLinePainter';

class Field {
    constructor() {
        // create a wrapper around native canvas element (with id="c")
        this.canvas = new fabric.Canvas('design-surface', {
            backgroundColor: 'green',
            height: FieldDimensions.height,
            width: FieldDimensions.width
        });

        // create a rectangle object
        var rect = new fabric.Rect({
            left: 10,
            top: 10,
            fill: 'red',
            width: 10,
            height: 10,
            cornerColor: 'black',
            transparentCorners: false,
            cornerSize: 8,
            snapAngle: 45
            //        snapThreshold: 45
        });

        var triangle = new fabric.Triangle({
            // cosider center of object the origin. eg, rotate around center.
            originX: 'center',
            originY: 'center',
            width: 10,
            height: 10,
            fill: 'blue',
            left: 60,
            top: 60,
            //angle: 135, // angle of object. correspond to direction.
            cornerColor: 'black',
            borderColor: 'black',
            cornerStyle: 'circle',
            borderDashArray: [3, 3]
        });

        // "add" rectangle onto canvas
        this.canvas.add(rect, triangle);

        YardLinePainter.paint(this.canvas);

        this.resize();
    }

    resize() {
        var size = this.getSize();
        // set css size to scale canvas to parent area
        this.canvas.setDimensions({ height: size.height + 'px', width: size.width + 'px' }, { cssOnly: true });
        this.canvas.renderAll();
    }
    
    getSize() {
        var parentEl = angular.element('.design-surface')[0];
        var size = {
            height: parentEl.clientWidth * .5,
            width: parentEl.clientWidth
        };
        return size;
    }
}


export default Field;