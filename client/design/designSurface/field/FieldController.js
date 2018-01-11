import StrideType from '/client/lib/StrideType';
import FieldDimensions from '/client/lib/FieldDimensions';
import FieldResizer from './FieldResizer';
import FieldPainter from './FieldPainter';
import MarcherFactory from './MarcherFactory';
import PositionCalculator from '/client/lib/PositionCalculator';
import Marcher from './Marcher';
import TurnMarker from './TurnMarker';
import MemberPath from './MemberPath';
import { StepPoint, FieldPoint } from '/client/lib/Point';
import MemberPositionCalculator from '/client/lib/drill/MemberPositionCalculator';

import 'fabric-customise-controls';

class FieldController {

    constructor(drill, eventService) {
        this.drill = drill;
        this.canvas = this.createCanvas();
        this.eventService = eventService;
        this.marchers = {};
        this.paths = [];
        this.arePathsVisible = false;
        this.fieldPainter = new FieldPainter(this.canvas);

        //this.initCustomCorners();
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
            backgroundColor: '#40703B', // huntergreen //'green',
            height: FieldDimensions.height,
            width: FieldDimensions.width,
            uniScaleTransform: true,
            renderOnAddRemove: false // performance optimization
        });
    }

    draw() {
        this.fieldPainter.paint();
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

        _.each(this.marchers, m => {
            let p = this.createMemberPath(m.member);
            if (p) {
                this.paths.push(p);
                this.canvas.add(p);
            }
        });
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
        for (var i = 0; i < 30; i++) {
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
        this.canvas.renderAll();
    }

    get isGridVisible() {
        return this.fieldPainter.isGridVisible;
    }

    set isGridVisible(isVisible) {
        this.fieldPainter.isGridVisible = isVisible;
        //        isVisible ? this.fieldPainter.showGrid(this.strideType) : this.fieldPainter.hideGrid();
        this.update();
    }

    get isLogoVisible() {
        return this.fieldPainter.isLogoVisible;
    }

    set isLogoVisible(isVisible) {
        this.fieldPainter.isLogoVisible = isVisible;
        this.update();
    }

    strideTypeChanged(strideType) {
        this.strideType = strideType;
        if (this.fieldPainter.isGridVisible)
            this.fieldPainter.showGrid(strideType);
        else
            this.fieldPainter.hideGrid();
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

            let state = {
                count: this.drill.count,
                strideType: member.currentState.strideType,
                stepType: member.currentState.stepType,
                x: fieldPoint.x,
                y: fieldPoint.y,
                direction: member.currentState.direction,
                isSelected: member.isSelected,
                isVisible: member.isVisible
            };

            marcher.update(state);
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

    sizeToFit() {
        FieldResizer.sizeToFit(this.canvas);
    }

    zoomIn() {
        FieldResizer.zoomIn(this.canvas);
    }

    zoomOut() {
        FieldResizer.zoomOut(this.canvas);
    }

    wireUpEvents() {
        var self = this;
        var canvas = this.canvas;

        this.canvas.on('mouse:move', this.onMouseMove.bind(self));

        this.canvas.on('selection:created', this.onSelectionCreated.bind(self));

        //this.canvas.on('selection:cleared', this.onSelectionCleared.bind(self));

        this.canvas.on('object:selected', this.onObjectSelected.bind(self));

        // this.canvas.on('mouse:down', (evt) => {
        //     console.log(evt);
        // });

        this.wireUpContextMenu();
    }

    wireUpContextMenu() {
        var self = this;
        $('.upper-canvas').bind('contextmenu', function (e) {
            var clickPoint = self.adjustMousePoint(new fabric.Point(e.offsetX, e.offsetY));

            e.preventDefault();

            var objectFound = findMarcherAtPoint(self.canvas, clickPoint);

            console.log(objectFound);
        });
    }


    onSelectionCreated(evt) {
        evt.target.set({
            lockRotation: true,
            hasControls: false
        });
        var marchers = this.canvas.getActiveGroup().getObjects().filter(o => o.type == 'Marcher');
        var members = marchers.map(marcher => marcher.member);

        this.canvas.discardActiveGroup(); // import to call this BEFORE emitting event, causes strange effect on position
        this.eventService.notifyObjectsSelected({ members: members, marchers: marchers });
    }

    onObjectSelected(evt) {
        // ignore if triggered by group selection
        if (!this.canvas.getActiveObject()) return;

        if (this.canvas.getActiveObject().type != 'Marcher') return;

        var member = evt.target.member;

        if (!member || !member.isVisible) return;

        this.canvas.discardActiveObject();
        this.eventService.notifyObjectsSelected({ members: [member] });
    }

    // onSelectionCleared(evt) {
    //     console.log('selection cleared');
    // }

    onMouseMove(evt) {
        //if (!this.positionIndicatorEnabled) return; 

        var isSelecting = !!this.canvas._groupSelector; // sneaky way of determinig if dragging selection box
        if (evt.target == null && !isSelecting)
            this.positionIndicator.set('visible', true);
        else
            this.positionIndicator.set('visible', false);

        var self = this;
        var p = { x: evt.e.layerX, y: evt.e.layerY };
        var snappedPoint = FieldDimensions.snapPoint(this.strideType || StrideType.SixToFive, self.adjustMousePoint(p));

        self.positionIndicator.set('visible', this.positionIndicatorEnabled);
        self.positionIndicator.set('left', snappedPoint.x);
        self.positionIndicator.set('top', snappedPoint.y);
        self.canvas.renderAll();

        var pos = PositionCalculator.getPositionDescription(snappedPoint, this.strideType || StrideType.SixToFive);
        this.eventService.notifyPositionIndicator({ position: pos });
    }

    createPositionIndicator() {
        var rect = new fabric.Rect({
            left: 0,
            top: 0,
            width: 12,
            height: 12,
            rx: 12,
            ry: 12,
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
            y: point.y * (1 / zoomFactor.y)
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

function findMarcherAtPoint(canvas, point) {
    var objectFound;
    // find marcher
    canvas.forEachObject(function (obj) {
        if (!objectFound && obj.type == 'Marcher' && obj.containsPoint(point)) {
            objectFound = obj;
        }
    });
    return objectFound;
}


    // initCustomCorners() {
    //     var canvas = this.canvas;

    //     fabric.Canvas.prototype.customiseControls({
    //         tl: {
    //             action: 'remove',
    //             cursor: 'pointer'
    //         },
    //         // tr: {
    //         //     action: 'scale'
    //         // },
    //         // bl: {
    //         //     action: 'remove',
    //         //     cursor: 'pointer'
    //         // },
    //         br: {
    //             action: 'scale',
    //             //cursor: 'pointer'
    //         },
    //         mb: {
    //             action: 'moveDown',
    //             cursor: 'pointer'
    //         },
    //         mt: {
    //             action: {
    //                 'rotateByDegrees': 45,
    //             },
    //             cursor: 'pointer'
    //         },
    //         // mr: {
    //         //     action: function( e, target ) {
    //         //         target.set( {
    //         //             left: 200
    //         //         } );
    //         //         canvas.renderAll();
    //         //     }
    //         //  }
    //     }, function() {
    //         canvas.renderAll();
    //     } );

    //     fabric.Object.prototype.customiseCornerIcons({
    //         settings: {
    //             //borderColor: 'red',
    //             cornerSize: 20,
    //             cornerBackgroundColor: 'black',
    //             cornerShape: 'circle',
    //             cornerPadding: 10,
    //          },
    //         tl: {
    //             // icon: 'icons/rotate.svg'
    //             icon: 'icons/remove.svg'
    //         },
    //         // tr: {
    //         //     icon: 'icons/resize.svg'
    //         // },
    //         // bl: {
    //         //     icon: 'icons/remove.svg'
    //         // },
    //         // br: {
    //         //     icon: 'icons/up.svg'
    //         // },
    //         mb: {
    //             icon: 'icons/down.svg'
    //         }
    //     }, function() {
    //         canvas.renderAll();
    //     } );        
    // }
