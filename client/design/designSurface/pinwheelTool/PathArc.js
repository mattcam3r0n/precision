let PathArc = fabric.util.createClass(fabric.Group, {
    type: 'PathArc',

    initialize: function(args) {
        let options = {
            selectable: false,
            evented: false,
        };
        let objects = [
            createArc(args.origin,
                args.radius,
                args.startAngle,
                args.endAngle),
            createArrow(args.origin,
                args.radius,
                args.startAngle,
                args.endAngle,
                args.arcEndPoint,
                args.arrowAngle),
        ];

        this.callSuper('initialize', objects, options);
    },

    toObject: function() {
        return fabric.util.object.extend(this.callSuper('toObject'), {
        });
    },

    _render: function(ctx) {
        this.callSuper('_render', ctx);
    },
});

function createArc(pivotPoint, radius, startAngle, endAngle) {
    let arc = new fabric.Circle({
        originX: 'center',
        originY: 'center',
        fill: false,
        stroke: 'white',
        strokeWidth: 2,
        hasControls: false,
        lockMovementX: true,
        lockMovementY: true,
        hoverCursor: 'pointer',
        evented: false,
        selectable: false,
        radius: radius,
        left: pivotPoint.x,
        top: pivotPoint.y,
        startAngle: startAngle,
        endAngle: endAngle,
    });
    return arc;
}

function createArrow(pivotPoint,
                        radius,
                        startAngle,
                        endAngle,
                        arcEndPoint,
                        arrowAngle) {
    let arrow = new fabric.Triangle({
        type: 'PathArcArrow',
        originX: 'center',
        originY: 'center',
        fill: 'white',
        stroke: 'white',
        selectable: false,
        angle: arrowAngle,
        left: arcEndPoint.x,
        top: arcEndPoint.y,
        width: 15,
        height: 15,
    });
    return arrow;
}

export default PathArc;
