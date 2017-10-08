import StrideType from '/client/lib/StrideType';
import FieldDimensions from '/client/lib/FieldDimensions';
import FieldResizer from './FieldResizer';
import FieldPainter from './FieldPainter';
import MarcherFactory from './MarcherFactory';
import PositionCalculator from '/client/lib/PositionCalculator';
import Marcher from './Marcher';

class FieldController {

    constructor(drill, $scope) {
        this.drill = drill;
        this.canvas = this.createCanvas();
        this.$scope = $scope;
        this.marchers = {};
        
        this.draw();
        this.resize();
        this.wireUpEvents();
        this.synchronizeMarchers();

        this.positionIndicator = this.createPositionIndicator();
        this.positionIndicatorEnabled = true;
        
    }

    setDrill(drill) {
        this.drill = drill;
        this.synchronizeMarchers();
        this.update();
    }

    createCanvas() {
        return new fabric.Canvas('design-surface', {
            backgroundColor: 'green',
            height: FieldDimensions.height,
            width: FieldDimensions.width,
            uniScaleTransform: true
        });
    }

    draw() {
        FieldPainter.paint(this.canvas);        
    }

    update() {
        this.canvas.renderAll();
    }

    /**
     * members added or removed, so recreate marchers
     */
    membersChanged() {
        this.synchronizeMarchers();
        this.update();
    }

    /**
     * drill state has changed, update marcher positions
     */
    drillStateChanged() {
        this.updateMarcherPositions();
        this.update();
    }

    disablePositionIndicator() {
        this.positionIndicatorEnabled = false;
    }

    enablePositionIndicator() {
        this.positionIndicatorEnabled = true;
    }

    updateMarcherPositions() {
        if (!this.drill || !this.marchers) return;

        for (var id in this.marchers) {
            let marcher = this.marchers[id];
            let member = marcher.member;

            var fieldPoint = FieldDimensions.toFieldPoint({ x: member.currentState.x, y: member.currentState.y }, member.currentState.strideType || StrideType.SixToFive);
            marcher.set('left', fieldPoint.x);
            marcher.set('top', fieldPoint.y);
            marcher.set('angle', member.currentState.direction);
            marcher.setCoords();
        }
    }

    synchronizeMarchers() {
        if (!this.drill) return; 

        for (var id in this.marchers) {
            let marcher = this.marchers[id];
            this.destroyMarcher(marcher);
        }
        this.marchers = {};
        
        this.drill.members.forEach(member => {
            let newMarcher = MarcherFactory.createMarcher(member.initialState);
            newMarcher.member = member;
            this.marchers[member.id] = newMarcher;
            this.canvas.add(newMarcher);    
        });
    }

    destroyMarcher(marcher) {
        marcher.member = null;
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
        if (!this.positionIndicatorEnabled) return; 

        var self = this;
        var p = { x: evt.e.layerX, y: evt.e.layerY };
        var snappedPoint = FieldDimensions.snapPoint(StrideType.SixToFive, self.adjustMousePoint(p));
        
        self.positionIndicator.set('left', snappedPoint.x);
        self.positionIndicator.set('top', snappedPoint.y);
        self.canvas.renderAll();

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
            fill: 'yellow',
            stroke: 'yellow',
            selectable: false,
            evented: false,
            strokeWidth: 1,
            opacity: .5,
            originX: 'center',
            originY: 'center'
        });
        this.canvas.add(rect);
        return rect;
    }

    adjustMousePoint(point) {
        var zoomFactor = FieldResizer.getZoomFactor(); // to account for scaling of canvas
        return {
            x: point.x * (1 / zoomFactor.x),
            y: point.y * ( 1/ zoomFactor.y)
        };
    }


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


export default FieldController;