import FieldDimensions from '/client/lib/FieldDimensions';
import Direction from '/client/lib/Direction';
import StepDelta from '/client/lib/StepDelta';
import StepType from '/client/lib/StepType';
import StrideType from '/client/lib/StrideType';
import { Point, StepPoint, FieldPoint } from '/client/lib/Point';
import TurnMarker from './TurnMarker';
import MemberPositionCalculator from '/client/lib/drill/MemberPositionCalculator';

class MemberPath {
    constructor(field, member, counts) {
        this.field = field;
        this.member = member;
        this.counts = counts;

        this.segments = this.getSegments(member, counts);
        
        // create a path for segments
        this.turnMarkers = this.createTurnMarkers();
        this.path = this.createPath();
        
    }

    getSegments(member, counts) {
        var segments = [];
        var currentState = member.currentState;
        var lastState = null;
        var lastPoint = new StepPoint(currentState.strideType, currentState.x, currentState.y).toFieldPoint();
        for(var i = 0; i < counts; i++) {
            if (!MemberPositionCalculator.areStatesSame(lastState, currentState)) {
                segments.push({
                    strideType: currentState.strideType,
                    stepType: currentState.stepType,
                    direction: currentState.direction,
                    point: lastPoint
                });
            }
            lastState = currentState;
            lastPoint = new StepPoint(currentState.strideType, currentState.x, currentState.y).toFieldPoint();
            currentState = MemberPositionCalculator.stepForward(member, currentState);
        }
        return segments;
    }

    get points() {
        var points = this.segments.map(s => s.point);
        return points;
    }

    getTailPoint() {
        var lastSegment = this.segments[this.segments.length - 1];
        var deltaInSteps = StepDelta.getDelta(lastSegment.strideType, lastSegment.stepType, lastSegment.direction, 6);
        var stepPoint = new StepPoint(lastSegment.strideType, deltaInSteps.deltaX, deltaInSteps.deltaY );
        var fieldPoint = stepPoint.toFieldPoint();
        fieldPoint.add(lastSegment.point);
        return fieldPoint;
    }

    createPathExpression(points) {
        var pathExpr = "M ";
        points.forEach(p => {
            pathExpr += p.x + ' ' + p.y + ' L ';
        });
        return pathExpr.slice(0, -2);
    }

    createPath() {
        if (this.path)
            this.field.canvas.remove(this.path);

        var points = this.points;
        points.push(this.getTailPoint());
        var pathExpr = this.createPathExpression(points);

        var path = new fabric.Path(pathExpr, {
            stroke: "black",
            strokeWidth: 2,
            strokeDashArray: [3, 3],
            fill: false,
            selectable: false,
            evented: false
        });
        this.field.canvas.add(path);
        return path;
    }

    updatePath() {
        this.path = this.createPath();
    }

    createTurnMarkers() {
        var self = this;
        var points = self.points.slice(1); //.map(s => s.point);
        var markers = [];

        points.forEach((p, i) => {
            let lineDir = self.segments[i].direction;
            let strideType = self.segments[i].strideType;
            let turnDir = self.segments[i + 1].direction;

            let m = new TurnMarker(turnDir, lineDir);

            m.set('left', p.x);
            m.set('top', p.y);
            m.point = p;
            m.pointIndex = i + 1;
            m.direction = lineDir;
            markers.push(m);

            var throttledUpdatePath = _.throttle(this.updatePath, 250).bind(this);
            m.on('moving', evt => {
                var endPoint = new Point(m.left, m.top);

                var snappedEndPoint = this.snapLineToDirection(this.points[m.pointIndex-1], endPoint, m.direction);
                snappedEndPoint = new Point(FieldDimensions.snapPoint(strideType, snappedEndPoint));
                var delta = snappedEndPoint.difference(m.point);

                // update this point
                m.point.x = snappedEndPoint.x;
                m.point.y = snappedEndPoint.y;

                // update following points
                for(let i = m.pointIndex + 1; i < self.points.length; i++) {
                    self.points[i].add(delta);
                }
                // update following turns
                for(let i = m.pointIndex; i < self.turnMarkers.length; i++) {
                    self.turnMarkers[i].left += delta.x;
                    self.turnMarkers[i].top += delta.y;
                    self.turnMarkers[i].setCoords();
                }
                
                m.left = snappedEndPoint.x;
                m.top = snappedEndPoint.y;

                throttledUpdatePath();
            });
        });


        return markers;
    }

    snapLineToDirection(from, to, dir) {
        if (dir == Direction.E || dir == Direction.W) {
            return new Point({
                x: to.x,
                y: from.y
            });
        }

        if (dir == Direction.S || dir == Direction.N) {
            return new Point({
                x: from.x,
                y: to.y
            });
        }

        if (dir == Direction.NE || dir == Direction.SW) {
            return new Point({ // y = mx + b  
                x: to.x,
                y: from.y - (to.x - from.x) 
            });
        }

        if (dir == Direction.NW || dir == Direction.SE) {
            return new Point({ // y = mx + b  
                x: to.x,
                y: from.y + (to.x - from.x)
            });
        }

    }

    dispose() {
        this.field.canvas.remove(path);
        this.turnMarkers.forEach(m => {
            this.field.canvas.remove(m);            
        });
    }
}

export default MemberPath;
