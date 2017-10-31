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
            height: 15,
            width: 15            
        });
        children.push(rect);

//        var pathExpr = "M 15 15 L 15 0 L 10 5 M 15 0 L 20 5 "; 
//        var pathExpr = "M 7.5 7.5 L 7.5 0 L 5 2.5 M 7.5 0 L 10 2.5 "; 
        var pathExpr = "M 7.5 15 L 7.5 0 L 0 5 M 7.5 0 L 15 5 "; 
        var path = new fabric.Path(pathExpr, {
            fill: false,
            stroke: 'whitesmoke',
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