import FieldDimensions from '/client/lib/FieldDimensions';
import Direction from '/client/lib/Direction';
import StrideType from '/client/lib/StrideType';


var TurnMarker = fabric.util.createClass(fabric.Group, {
    type: "TurnMarker",
    // cosider center of object the origin. eg, rotate around center.
    originX: 'center',
    originY: 'center',
    angle: 0,
    hasControls: false,

    initialize: function (turnDir, options) {
        options = options || {};
        var self = this;
        var children = [];

        options.angle = turnDir;

        var rect = new fabric.Rect({
            fill: false,
            stroke: 'rgba(0,0,0,0)',
            strokeWidth: 1,
            height: 30,
            width: 30            
        });
        children.push(rect);

        var pathExpr = "M 15 15 L 15 0 L 10 5 M 15 0 L 20 5 "; //L 15 30 M 15 30 L 10 20 M 15 30 L 20 20";
        var path = new fabric.Path(pathExpr, {
            fill: false,
            stroke: 'black',
            strokeWidth: 3,
        });
        children.push(path);

        this.callSuper('initialize', children, options);

        // this.on('moving', function(evt) {
        //     console.log(evt);
        //     var point = { x: self.left, y: self.top };
        //     var snappedPoint = FieldDimensions.snapPoint(StrideType.SixToFive, point);
        //     self.set('left', snappedPoint.x);
        //     self.set('top', snappedPoint.y);
        // });

        // this.on('mouseover', function () {
        //     this.set('height', this.height + 4);
        //     this.set('width', this.width + 4);
        //     this.set('strokeWidth', 2);
        // });

        // this.on('mouseout', function () {
        //     this.set('height', this.height - 4);
        //     this.set('width', this.width - 4);
        //     this.set('strokeWidth', 1);
        // });

        // this.on('selected', function() {
        //   this.set('stroke', 'yellow');
        // });
        // this.on('deselected', function() {
        //   this.set('stroke', 'black');
        // });
    },

    _render: function (ctx) {
        this.callSuper('_render', ctx);
    }
});

export default TurnMarker;