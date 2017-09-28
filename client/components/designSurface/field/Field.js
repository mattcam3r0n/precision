import StrideType from '/client/lib/StrideType';
import FieldDimensions from '/client/lib/FieldDimensions';
import FieldResizer from './FieldResizer';
import YardLinePainter from './YardLinePainter';
import MarcherFactory from './MarcherFactory';

class Field {

    constructor(drill) {
        this.canvas = this.createCanvas();
        this.positionIndicator = this.createPositionIndicator();
        
        this.drawField();
        this.addMarchers(drill.members);
        this.resize();

        this.wireUpEvents();
    }

    createCanvas() {
        return new fabric.Canvas('design-surface', {
            backgroundColor: 'green',
            height: FieldDimensions.height,
            width: FieldDimensions.width,
            uniScaleTransform: true
        });
    }

    drawField() {
        YardLinePainter.paint(this.canvas);
    }

    resize() {
        FieldResizer.resize(this.canvas);
    }

    wireUpEvents() {
        var self = this;
        var canvas = this.canvas;
        this.canvas.on('mouse:move', function(evt) {
            var p = { x: evt.e.layerX, y: evt.e.layerY };
            var snappedPoint = FieldDimensions.snapPoint(StrideType.SixToFive, self.adjustMousePoint(p));
            
            //console.log(snappedPoint);

            self.positionIndicator.set('left', snappedPoint.x);
            self.positionIndicator.set('top', snappedPoint.y);
            canvas.renderAll();
        });
    }

    createPositionIndicator() {
        var rect = new fabric.Rect({
            left: 0,
            top: 0,
            width: 15,
            height: 15,
            rx: 15,
            ry: 15,
            fill: 'darkgray',
            stroke: 'darkgray',
            selectable: false,
            evented: false,
            strokeWidth: 1,
            opacity: .75,
            originX: 'center',
            originY: 'center'
        });
        this.canvas.add(rect);
        return rect;
    }

    addMarchers(members) {
        if (!members || members.length == 0)
            return;

        members.forEach(m => {
            m.marcher = MarcherFactory.createMarcher(m.initialState);
            m.marcher.member = m;
            this.canvas.add(m.marcher);    
        });       
    }

    adjustMousePoint(point) {
        var zoomFactor = FieldResizer.getZoomFactor(); // to account for scaling of canvas
        return {
            x: point.x * (1 / zoomFactor.x),
            y: point.y * ( 1/ zoomFactor.y)
        };
    }

    // adjustMousePoint(point) {
    //     var zoomFactor = FieldResizer.getZoomFactor(); // to account for scaling of canvas
    //     return {
    //         x: (point.x * zoomFactor.x,
    //         y: point.y * zoomFactor.y
    //     };        
    // }

    getAbsoluteCoords(object) {
        var zoomFactor = FieldResizer.getZoomFactor(); // to account for scaling of canvas
        return {
            left: (object.left * zoomFactor.x) + this.canvas._offset.left,
            top: (object.top * zoomFactor.y) + this.canvas._offset.top
          };              
    }
}


export default Field;