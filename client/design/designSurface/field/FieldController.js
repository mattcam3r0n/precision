import StrideType from '/client/lib/StrideType';
import FieldDimensions from '/client/lib/FieldDimensions';
import FieldResizer from './FieldResizer';
import FieldPainter from './FieldPainter';
import FootprintPainter from './FootprintPainter';
import MarcherFactory from './MarcherFactory';
import PositionCalculator from '/client/lib/PositionCalculator';
// import Marcher from './Marcher';
// import TurnMarker from './TurnMarker';
// import MemberPath from './MemberPath';
import {StepPoint} from '/client/lib/Point';
import MemberPositionCalculator from '/client/lib/drill/MemberPositionCalculator';
import Events from '/client/lib/Events';
import Lasso from '../lassoTool/Lasso';

import 'fabric-customise-controls';

class FieldController {
    constructor(drill, eventService) {
        this.drill = drill;
        this.canvas = this.createCanvas();
        this.fieldPainter = new FieldPainter(this.canvas);
        this.footprintPainter = new FootprintPainter(this.canvas);
        this.eventService = eventService;
        this.subscriptions = eventService.createSubscriptionManager();
        this.marchers = {};
        this.lasso = new Lasso(this);

        // this.initCustomCorners();
        this.draw();
        this.resize();
        this.wireUpEvents();
        this.synchronizeMarchers();

        this.positionIndicator = this.createPositionIndicator();
        this.positionIndicatorEnabled = true;
    }

    dispose() {
        this.lasso.dispose();
        this.canvas.dispose();
        this.subscriptions.unsubscribeAll();
        this.canvas.off('mouse:move', this.onMouseMoveHandler);
        this.canvas.off('selection:created', this.onSelectionCreatedHandler);
        this.canvas.off('object:selected', this.onObjectSelectedHandler);
        this.canvas.__eventListeners = [];
        this.canvas = null;
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
            stateful: false,
            renderOnAddRemove: false, // performance optimization
        });
    }

    draw() {
        this.fieldPainter.paint();
    }

    update() {
        this.canvas.renderAll();
    }

    showFootprints(pointSet) {
        this.footprintPainter.paint(pointSet);
    }

    clearFootprints() {
        this.footprintPainter.clear();
    }

    createMemberPath(member) {
        let points = this.getMemberPathPoints(member);
        let pathExpr = this.getPathFromPoints(points);

        if (!points || points.length == 0) {
            return null;
        }

        return new fabric.Path(pathExpr, {
            left: points[0].x,
            top: points[0].y,
            stroke: 'black',
            strokeWidth: 2,
            opacity: .6,
            fill: false,
        });
    }

    getMemberPathPoints(member) {
        let points = [];
        points.push(new StepPoint(member.initialState.strideType,
            member.initialState.x,
            member.initialState.y
        ).toFieldPoint());

        let pos = null;
        for (let i = 0; i < 30; i++) {
            pos = MemberPositionCalculator.stepForward(member, pos);
            let p = new StepPoint(pos.strideType, pos.x, pos.y).toFieldPoint();
            points.push(p);
        }
        return points;
    }

    getPathFromPoints(points) {
        let pathExpr = 'M ';
        points.forEach((p) => {
            pathExpr += p.x + ' ' + p.y + ' L ';
        });
        return pathExpr.slice(0, -2);
    }

    /**
     * members added or removed, so recreate marchers
     */
    membersChanged() {
        this.synchronizeMarchers();
        // this.updateMarcherSelection();
        this.update();
    }

    /**
     * drill state has changed, update marcher positions
     * @param {object} args
     */
    drillStateChanged(args) {
        this.updateMarchers();
        this.update();
    }

    // selectionChanged(args) {
    // console.log('selectionChanged');
    //     this.updateMarcherSelection();
    //     this.update();
    // }

    showGrid() {
        this.fieldPainter.isGridVisible = true;
        this.update();
    }

    hideGrid() {
        this.fieldPainter.isGridVisible = false;
        this.update();
    }

    showLogo() {
        this.fieldPainter.isLogoVisible = true;
        this.update();
    }

    hideLogo() {
        this.fieldPainter.isLogoVisible = false;
        this.update();
    }

    strideTypeChanged(strideType) {
        this.strideType = strideType;
        if (this.fieldPainter.isGridVisible) {
            this.fieldPainter.showGrid(strideType);
        } else {
            this.fieldPainter.hideGrid();
        }
        this.update();
    }

    disablePositionIndicator() {
        this.positionIndicatorEnabled = false;
    }

    enablePositionIndicator() {
        this.positionIndicatorEnabled = true;
    }

    updateMarchers() {
        if (!this.drill || !this.marchers) return;

        // eslint-disable-next-line guard-for-in
        for (let id in this.marchers) {
            let marcher = this.marchers[id];
            let member = marcher.member;

            let fieldPoint = FieldDimensions.toFieldPoint({
                x: member.currentState.x,
                y: member.currentState.y,
            }, member.currentState.strideType || StrideType.SixToFive);

            let state = {
                count: this.drill.count,
                strideType: member.currentState.strideType,
                stepType: member.currentState.stepType,
                x: fieldPoint.x,
                y: fieldPoint.y,
                direction: member.currentState.direction,
                isSelected: member.isSelected,
                isVisible: member.isVisible,
            };

            marcher.update(state);
            // marcher.setCoords();
        }
    }

    updateSelectedMarchers() {
        if (!this.drill || !this.marchers) return;
        // eslint-disable-next-line guard-for-in
        for (let id in this.marchers) {
            let marcher = this.marchers[id];
            marcher.updateSelection({ isSelected: marcher.member.isSelected });
        }
        this.update();
    }

    synchronizeMarchers() {
        if (!this.drill) return;

        // eslint-disable-next-line guard-for-in
        for (let id in this.marchers) {
            let marcher = this.marchers[id];
            this.destroyMarcher(marcher);
        }
        this.marchers = {};

        this.drill.members.forEach((member) => {
            let newMarcher = MarcherFactory.createMarcher({
                strideType: member.currentState.strideType,
                x: member.currentState.x,
                y: member.currentState.y,
                direction: member.currentState.direction,
                color: member.color || 'red',
            });
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
        let self = this;

        // fabric.util.addListener(this.canvas.upperCanvasEl, 'dblclick', function(e) {
        //     console.log('dblclick', e);
        // });

        this.onMouseMoveHandler = this.onMouseMove.bind(self);
        this.onSelectionCreatedHandler = this.onSelectionCreated.bind(self);
        this.onObjectSelectedHandler = this.onObjectSelected.bind(self);

        // this.canvas.on('mouse:up', this.onMouseUp.bind(self));
        this.canvas.on('mouse:move', this.onMouseMoveHandler);
        this.canvas.on('selection:created', this.onSelectionCreatedHandler);
        this.canvas.on('object:selected', this.onObjectSelectedHandler);

        this.wireUpContextMenu();

        this.subscriptions.subscribe(Events.showGrid, this.showGrid.bind(this));
        this.subscriptions.subscribe(Events.hideGrid, this.hideGrid.bind(this));
        this.subscriptions.subscribe(Events.showLogo, this.showLogo.bind(this));
        this.subscriptions.subscribe(Events.hideLogo, this.hideLogo.bind(this));
        this.subscriptions.subscribe(Events.membersSelected,
            this.updateSelectedMarchers.bind(this));
    }

    wireUpContextMenu() {
        let self = this;
        $('.upper-canvas').bind('contextmenu', function(e) {
            // eslint-disable-next-line max-len
            let clickPoint = self.adjustMousePoint(new fabric.Point(e.offsetX, e.offsetY));

            e.preventDefault();

            let objectFound = findMarcherAtPoint(self.canvas, clickPoint);

            console.log(objectFound, e);
            self.eventService.notify(Events.showContextMenu, {
                point: { left: e.clientX, top: e.clientY },
            });
        });
    }


    onSelectionCreated(evt) {
        evt.target.set({
            lockRotation: true,
            hasControls: false,
        });
        let marchers = this.canvas
                        .getActiveGroup()
                        .getObjects()
                        .filter((o) => o.type == 'Marcher');
        let members = marchers.map((marcher) => marcher.member);

        // important to call this BEFORE emitting event, causes strange effect on position
        this.canvas.discardActiveGroup();
        // this.eventService.notify(Events.objectsSelected, {
        //     members: members,
        //     marchers: marchers,
        // });
        this.notifyObjectsSelected({
            members: members,
            marchers: marchers,
        });
    }

    onObjectSelected(evt) {
        // ignore if triggered by group selection
        if (!this.canvas.getActiveObject()) return;

        if (this.canvas.getActiveObject().type != 'Marcher') return;

        let member = evt.target.member;

        if (!member || !member.isVisible) return;

        this.canvas.discardActiveObject();
//        this.eventService.notify(Events.objectsSelected, {members: [member]});
        this.notifyObjectsSelected({members: [member]});
    }

    notifyObjectsSelected(args) {
        this.eventService.notify(Events.objectsSelected, args);
    }

    // onSelectionCleared(evt) {
    //     console.log('selection cleared');
    // }

    onMouseUp(evt) {
        const self = this;
        // console.log(evt);
        if (evt.isClick && evt.e.shiftKey) {
            self.startLasso(evt);
        }

        if (evt.isClick && self.lasso) {
            self.addLassoPoint(evt);
        }
    }

    startLasso(evt) {
        const self = this;
        const point = self.adjustMousePoint({x: evt.e.layerX, y: evt.e.layerY});
        this.lasso = new Lasso(this, point);
    }

    addLassoPoint(evt) {
        const self = this;
        const point = self.adjustMousePoint({x: evt.e.layerX, y: evt.e.layerY});
        self.lasso.addPoint(point);
    }

    onMouseMove(evt) {
        // if (!this.positionIndicatorEnabled) return;

        let isSelecting = !!this.canvas._groupSelector; // sneaky way of determinig if dragging selection box
        if (evt.target == null && !isSelecting) {
            this.positionIndicator.set('visible', true);
        } else {
            this.positionIndicator.set('visible', false);
        }

        let self = this;
        let p = {x: evt.e.layerX, y: evt.e.layerY};
        let snappedPoint = FieldDimensions
                            .snapPoint(this.strideType || StrideType.SixToFive,
                                self.adjustMousePoint(p));

        self.positionIndicator.set('visible', this.positionIndicatorEnabled);
        self.positionIndicator.set('left', snappedPoint.x);
        self.positionIndicator.set('top', snappedPoint.y);
        self.canvas.renderAll();

        let pos = PositionCalculator
                    .getPositionDescription(snappedPoint,
                        this.strideType || StrideType.SixToFive);
        this.eventService.notify(Events.positionIndicator, {position: pos});
    }

    createPositionIndicator() {
        let rect = new fabric.Rect({
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
            originY: 'center',
        });
        this.canvas.add(rect);
        return rect;
    }

    adjustMousePoint(point) {
        let zoomFactor = FieldResizer.getZoomFactor(); // to account for scaling of canvas
        return {
            x: point.x * (1 / zoomFactor.x),
            y: point.y * (1 / zoomFactor.y),
        };
    }

    getAbsoluteCoords(object) {
        let zoomFactor = FieldResizer.getZoomFactor(); // to account for scaling of canvas
        let coords = {};

        if (object.left) {
            // eslint-disable-next-line max-len
            coords.left = (object.left * zoomFactor.x) + this.canvas._offset.left;
        }

        if (object.top) {
            coords.top = (object.top * zoomFactor.y) + this.canvas._offset.top;
        }

        if (object.width) {
            coords.width = (object.width * zoomFactor.x);
        }

        if (object.height) {
            coords.height = (object.height * zoomFactor.y);
        }

        return coords;
    }

    getLeftmostMarcherPosition() {
        let sorted = _.sortBy(this.marchers, (m) => {
            return m.left;
        });

        let leftmost = _.first(sorted);

        return {
            x: leftmost.left,
            y: leftmost.top,
            left: leftmost.left,
            top: leftmost.top,
        };
    }
}

export default FieldController;

function findMarcherAtPoint(canvas, point) {
    let objectFound;
    // find marcher
    canvas.forEachObject(function(obj) {
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
