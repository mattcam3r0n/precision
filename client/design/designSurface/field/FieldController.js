import StrideType from '/client/lib/StrideType';
import FieldDimensions from '/client/lib/FieldDimensions';
import FieldResizer from './FieldResizer';
import FieldPainter from './FieldPainter';
import MarcherFactory from './MarcherFactory';
import PositionCalculator from '/client/lib/PositionCalculator';
import Marcher from './Marcher';
import FileIndicator from './FileIndicator';
import TurnMarker from './TurnMarker';

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
        
        this.testTurnMarker();
        //this.test();
    }

    testTurnMarker() {
        var m = new TurnMarker();
        var p = FieldDimensions.toFieldPoint({ x: 18, y: 6}, StrideType.SixToFive);
        console.log(p);
        m.set('top', p.y);
        m.set('left', p.x);
        this.canvas.add(m);

        var m = new TurnMarker();
        var p = FieldDimensions.toFieldPoint({ x: 18, y: 8}, StrideType.SixToFive);
        console.log(p);
        m.set('top', p.y);
        m.set('left', p.x);
        this.canvas.add(m);

        this.update();
    }

    // test() {            
    //       var i = new FileIndicator([{ x: 60, y: 60 }, { x: 120, y: 60 }, { x: 120, y: 120 }], {
    //           left: 100,
    //           top: 100
    //       });
    //       this.canvas.add(i);
    //       this.canvas.bringToFront(i);
    //       //this.canvas.add(line);
    // }

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
    drillStateChanged(args) {
        this.updateMarchers(args);
        this.update();
    }

    disablePositionIndicator() {
        this.positionIndicatorEnabled = false;
    }

    enablePositionIndicator() {
        this.positionIndicatorEnabled = true;
    }

    updateMarchers(args) {
        if (!this.drill || !this.marchers) return;

        for (var id in this.marchers) {
            let marcher = this.marchers[id];
            let member = marcher.member;

            let fieldPoint = FieldDimensions.toFieldPoint({ x: member.currentState.x, y: member.currentState.y }, member.currentState.strideType || StrideType.SixToFive);

            // set position and direction
            marcher.set('left', fieldPoint.x);
            marcher.set('top', fieldPoint.y);
            marcher.set('angle', member.currentState.direction);
            // set selection 
            marcher.set('stroke', member.isSelected ? 'yellow' : 'black');
            
            marcher.setCoords();
        }

        // TODO: refactor to separate functions
        // if (args && args.selectedFiles) {
        //     if (this.fileIndicators) {
        //         this.fileIndicators.forEach(fi => {
        //             this.canvas.remove(fi);
        //         });
        //     }
        //     this.fileIndicators = [];
        //     args.selectedFiles.forEach(f => {
        //         let dir = f.leader.member.currentState.direction;
        //         let leaderPoint = FieldDimensions.toFieldPoint({ x: f.leader.member.currentState.x, y: f.leader.member.currentState.y }, f.leader.member.currentState.strideType || StrideType.SixToFive);
        //         let linePoints = f.getLinePoints().map(p => {
        //             return FieldDimensions.toFieldPoint({ x: p.x, y: p.y }, f.leader.member.currentState.strideType || StrideType.SixToFive);
        //         });
        //         var adj = { 0: { x: 0, y: 2 }, 90: { x: -2, y: 0 }, 180: { x: 0, y: -2 }, 270: { x: 2, y: 0 } };
        //         // hack to adjust points
        //         linePoints.forEach(p => {
        //             p.x += adj[dir].x;
        //             p.y += adj[dir].y;
        //         });
        //         var i = new FileIndicator(linePoints, f.leader.member.currentState.direction, {
        //             // left: leaderPoint.x,
        //             // top: leaderPoint.y
        //         });
        //         console.log(i);
        //         this.fileIndicators.push(i);
        //         this.canvas.add(i);
        //         //this.canvas.sendToBack(i);    
        //     });
        // }

        
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

        this.canvas.on('selection:created', this.onSelectionCreated.bind(self));

        //this.canvas.on('selection:cleared', this.onSelectionCleared.bind(self));

        this.canvas.on('object:selected', this.onObjectSelected.bind(self));
    }

    onSelectionCreated(evt) {
        evt.target.set({
            lockRotation: true,
            hasControls: false
        });
        var marchers = this.canvas.getActiveGroup().getObjects();
        var members = marchers.map(marcher => marcher.member);
        
        this.canvas.discardActiveGroup(); // import to call this BEFORE emitting event, causes strange effect on position

        this.$scope.$emit('membersSelected', { members: members, marchers: marchers });
       
        // console.log(marchers);
    }

    onObjectSelected(evt) {
        // ignore if triggered by group selection
        if (!this.canvas.getActiveObject()) return;

        if (this.canvas.getActiveObject().type != 'Marcher') return;

        var member = evt.target.member;
        this.canvas.discardActiveObject();
        this.$scope.$emit('membersSelected', { members: [member] });
    }

    // onSelectionCleared(evt) {
    //     console.log('selection cleared');
    // }

    onMouseMove(evt) {
        if (!this.positionIndicatorEnabled) return; 
        
        var isSelecting = !!this.canvas._groupSelector; // sneaky way of determinig if dragging selection box
        if (evt.target == null && !isSelecting)
            this.positionIndicator.set('visible', true);
        else    
            this.positionIndicator.set('visible', false);

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
            fill: 'white',
            stroke: 'white',
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