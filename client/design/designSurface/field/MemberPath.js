import Direction from '/client/lib/Direction';
import StepDelta from '/client/lib/StepDelta';
import StepType from '/client/lib/StepType';
import StrideType from '/client/lib/StrideType';
import { Point, StepPoint, FieldPoint } from '/client/lib/Point';
import TurnMarker from './TurnMarker';

class MemberPath {
    constructor(field) {
        this.field = field;
        // set origin (need this in field points)
        // this.origin = {
        //     count: 0,
        //     stepPoint: {
        //         strideType: StrideType.SixToFive,
        //         x: 18,
        //         y: 6
        //     }
        // };

        this.origin = { x: 180, y: 60 };
        this.points = [
            { x: 180, y: 60 },
            { x: 240, y: 60 },
//            { x: 240, y: 120}
        ];

        // // get segments for next N counts?
        // this.segments = [{
        //     strideType: StrideType.SixToFive,
        //     stepType: StepType.Full,
        //     direction: Direction.E,
        //     counts: 6
        // }, {
        //     strideType: StrideType.SixToFive,
        //     stepType: StepType.Full,
        //     direction: Direction.S,
        //     counts: 6
        // }, {
        //     strideType: StrideType.SixToFive,
        //     stepType: StepType.Full,
        //     direction: Direction.E,
        //     counts: 6
        // }];
        
        // create a path for segments
        this.turnMarkers = this.createTurnMarkers();
        this.path = this.createPath();
        
        console.log(this.path);
        // create turn marker for each segment  (except first)
    }

    // getPathPoints() {
    //     var origin = new StepPoint(this.origin.stepPoint.strideType, 
    //                                         this.origin.stepPoint.x, 
    //                                         this.origin.stepPoint.y);
        
    //     var point = origin;
    //     var points = [point];
    //     this.segments.forEach(s => {
    //         let delta = StepDelta.getDelta(s.strideType, s.stepType, s.direction, s.counts);
    //         point = new StepPoint(s.strideType, point.x + delta.deltaX, point.y + delta.deltaY);
    //         points.push( point );
    //     });

    //     return points.map(p => p.toFieldPoint());
    // }

    createPathExpression(points) {
        var pathExpr = "M ";
        this.points.forEach(p => {
            pathExpr += p.x + ' ' + p.y + ' L ';
        });

        return pathExpr.slice(0, -2);
    }

    createPath() {
        if (this.path)
            this.field.canvas.remove(this.path);

        var pathExpr = this.createPathExpression(this.points);
        var path = new fabric.Path(pathExpr, {
            stroke: "black",
            strokeWidth: 1,
            strokeDashArray: [3, 3],
            fill: false,
            selectable: false,
            evented: false
        });
        this.field.canvas.add(path);
        return path;
    }

    updatePath() {
        // this.path.path = [];
        // this.path.path.push(['M', this.points[0].x, this.points[0].y]);
        // for(var i = 1; i < this.points.length; i++) {
        //     this.path.path.push(['L', this.points[i].x, this.points[i].y]);
        // }

        // var canvas = this.field.canvas;
        // canvas.remove(this.path);
        // this.path = null;

        this.path = this.createPath();
        // canvas.add(this.path);

        //canvas.renderAll();
        // console.log(this.path);
        // this.path.setCoords();
        // this.path.canvas.renderAll();
    }

    createTurnMarkers() {
        var points = this.points.slice(1);
        var markers = [];

        points.forEach((p, i) => {
            let m = new TurnMarker();
            m.set('left', p.x);
            m.set('top', p.y);
            //m.set('lockMovementY', true);
            m.point = p;
            m.pointIndex = i + 1;
            markers.push(m);

            var throttledUpdatePath = _.throttle(this.updatePath, 250).bind(this);
            m.on('moving', evt => {
                // let delta = new Point(m.left, m.top).difference(m.point);
                
                // snap line / point to direction?
                
                // m.point.x += delta.x;
                // m.point.y += delta.y;

                // m.point.x = m.left;
                // m.point.y = m.top;

                var endPoint = new Point(m.left, m.top);
                var snappedEndPoint = this.snapLineToDirection(this.points[m.pointIndex-1], endPoint, Direction.N);
//console.log(snappedEndPoint);
                m.point.x = snappedEndPoint.x;
                m.point.y = snappedEndPoint.y;
                
                m.left = snappedEndPoint.x;
                m.top = snappedEndPoint.y;

                throttledUpdatePath();
            });
        });


        return markers;
    }

    snapLineToDirection(from, to, dir) {
        console.log('from', from);
        console.log('to', to);
        if (dir == Direction.E || dir == Direction.W) {
            return {
                x: to.x,
                y: from.y
            };
        }

        if (dir == Direction.S || dir == Direction.N) {
            return {
                x: from.x,
                y: to.y
            };
        }

        if (dir == Direction.NE || dir == Direction.SW) {
            return { // y = mx + b  
                x: to.x,
                y: from.y - (to.x - from.x) 
            };
        }

        if (dir == Direction.NW || dir == Direction.SE) {
            return { // y = mx + b  
                x: to.x,
                y: from.y + (to.x - from.x)
            };
        }

    }

    dispose() {

    }
}

export default MemberPath;
