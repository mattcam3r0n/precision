import StrideType from '/client/lib/StrideType';
import FieldDimensions from '/client/lib/FieldDimensions';
import FieldResizer from './FieldResizer';
import YardLinePainter from './YardLinePainter';
import MarcherFactory from './MarcherFactory';
import PositionCalculator from '/client/lib/PositionCalculator';

class Field {

    constructor(drill, $scope) {
        this.canvas = this.createCanvas();
        this.drill = drill;
        this.$scope = $scope;
        this.positionIndicator = this.createPositionIndicator();
        
        this.marchers = {};
        this.drawField();
        //this.addMarchers(drill.members);
        this.resize();

        this.wireUpEvents();

        this.synchronizeMarchers();
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
        this.drawFieldLogo();
    }

    drawFieldLogo() {
        var scaleFactor = 0.075;
        var self = this;
        var img = fabric.Image.fromURL('/nammb-logo.png', function(oImg) {
            oImg.scale(scaleFactor);
            oImg.selectable = false;
            oImg.evented = false;
            oImg.set('left', (FieldDimensions.width  / 2) - (oImg.width * scaleFactor / 2));
            oImg.set('top', (FieldDimensions.height / 2) - (oImg.height * scaleFactor / 2));
            oImg.set('opacity', .75);
            self.canvas.add(oImg);
        });
    }

    update() {
        this.canvas.renderAll();
    }

    drillChanged() {
        this.synchronizeMarchers();
        this.update();
    }

    synchronizeMarchers() {
        for (var id in this.marchers) {
            let marcher = this.marchers[id];
            if (!this.drill.band.members.includes(marcher.member)) {
                this.destroyMarcher(marcher);
            }
        }
        this.drill.band.members.forEach(member => {
            if (!this.marchers[member.id]) {
                let newMarcher = MarcherFactory.createMarcher(member.initialState);
                this.marchers[member.id] = newMarcher;
                this.canvas.add(newMarcher);    
            }
        });
    }

    destroyMarcher(marcher) {
        this.canvas.remove(marcher);
    }

    resize() {
        FieldResizer.resize(this.canvas);
    }

    wireUpEvents() {
        var self = this;
        var canvas = this.canvas;

        this.canvas.on('mouse:move', this.onMouseMove.bind(self));
    }

    onMouseMove(evt) {
        var self = this;
        var p = { x: evt.e.layerX, y: evt.e.layerY };
        var snappedPoint = FieldDimensions.snapPoint(StrideType.SixToFive, self.adjustMousePoint(p));
        
        //console.log(snappedPoint);

        self.positionIndicator.set('left', snappedPoint.x);
        self.positionIndicator.set('top', snappedPoint.y);
        self.canvas.renderAll();

        //self.canvas.fire('positionIndicator', {});
        var pos = PositionCalculator.getPositionDescription(snappedPoint);
        self.$scope.$emit('positionIndicator', { position: pos });
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
        var coords = {};
        
        if (object.left)
            coords.left = (object.left * zoomFactor.x) + this.canvas._offset.left;
        
        if (object.top)
            coords.top = (object.top * zoomFactor.y) + this.canvas._offset.top;

        if (object.width)
            coords.width = (object.width * zoomFactor.x); // + this.canvas._offset.left
        
        if (object.height)
            coords.height = (object.height * zoomFactor.y);

        return coords;            
    }
}


export default Field;