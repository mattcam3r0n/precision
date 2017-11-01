import StrideType from '/client/lib/StrideType';
import FieldDimensions from '/client/lib/FieldDimensions';
import FieldResizer from './FieldResizer';
import FieldPainter from './FieldPainter';
import MarcherFactory from './MarcherFactory';
import PositionCalculator from '/client/lib/PositionCalculator';
import Marcher from './Marcher';
import FileIndicator from './FileIndicator';
import TurnMarker from './TurnMarker';
import MemberPath from './MemberPath';
import { StepPoint, FieldPoint } from '/client/lib/Point';
import MemberPositionCalculator from '/client/lib/drill/MemberPositionCalculator';

class FieldController {

    constructor(drill, $scope) {
        this.drill = drill;
        this.canvas = this.createCanvas();
        this.$scope = $scope;
        this.marchers = {};
        this.paths = [];
        this.arePathsVisible = false;
        
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

    showPaths(counts) {
        if (this.arePathsVisible) {
            this.hidePaths();
            return;            
        }
        this.arePathsVisible = true;
    console.log(this.paths);
        _.each(this.marchers, m => {
            let p = this.createMemberPath(m.member);
            if (p) {
                this.paths.push(p);
                this.canvas.add(p);
            }
        });
    console.log(this.paths);
    }

    hidePaths() {
        if (!this.paths) return;
        this.arePathsVisible = false;
        this.paths.forEach(p => {
            this.canvas.remove(p);
        });
        this.paths = [];
    }

    createMemberPath(member) {
        let points = this.getMemberPathPoints(member);
    console.log(points);
        let pathExpr = this.getPathFromPoints(points);

        if (!points || points.length == 0)
            return null;

        return new fabric.Path(pathExpr, {
            left: points[0].x,
            top: points[0].y,
            stroke: 'black',
            strokeWidth: 2,
            opacity: .6,
            fill: false
        });
    }

    getMemberPathPoints(member) {
        var points = [];
        points.push(new StepPoint(member.initialState.strideType, member.initialState.x, member.initialState.y).toFieldPoint());

        var pos = null;
        for(var i = 0; i < 30; i++) {
            pos = MemberPositionCalculator.stepForward(member, pos);
            let p = new StepPoint(pos.strideType, pos.x, pos.y).toFieldPoint();
            points.push(p);
        }
        // member.script.forEach(a => {
        //     if (a) {
        //         console.log(a);
        //         let p = new StepPoint(a.strideType, a.x, a.y).toFieldPoint();
        //         points.push(p);
        //     }
        // });
        return points;
    }

    getPathFromPoints(points) {
        var pathExpr = "M ";
        points.forEach(p => {
            pathExpr += p.x + ' ' + p.y + ' L ';
        });
        return pathExpr.slice(0, -2);    
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
            // hack to ensure isVisible prop is present
            member.isVisible = member.isVisible === undefined ? true : member.isVisible;
            marcher.set('visible', member.isVisible ? true : false);
            
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

    getLeftmostMarcherPosition() {
        var sorted = _.sortBy(this.marchers, m => {
            return m.left;
        });
        
        var leftmost = _.first(sorted);

        return {
            x: leftmost.left,
            y: leftmost.top,
            left: leftmost.left,
            top: leftmost.top
        };
    }
}


export default FieldController;