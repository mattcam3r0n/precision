import FieldDimensions from '/client/lib/FieldDimensions';
import Direction from '/client/lib/Direction';
import StrideType from '/client/lib/StrideType';


var CounterMarch = fabric.util.createClass(fabric.Group, {
    type: "CounterMarch",
    // cosider center of object the origin. eg, rotate around center.
    originX: 'center',
    originY: 'center',
    angle: 0,
    hasControls: false,

    initialize: function (fromDir, isLeftTurn, options) {
        options = options || {};
        var self = this;
        var children = [];

        options.angle = fromDir;
        options.flipX = isLeftTurn;

        var rect = new fabric.Rect({
            fill: false,
            stroke: 'rgba(0,0,0,0)',
            strokeWidth: 1,
            height: 30,
            width: 30            
        });
        children.push(rect);

        var pathExpr = "M 15 30 L 15 15 L 25 15 L 25 30 L 20 23 M 25 30 L 30 23"; //L 15 30 M 15 30 L 10 20 M 15 30 L 20 20";
        var path = new fabric.Path(pathExpr, {
            fill: false,
            stroke: 'black',
            strokeWidth: 3,
        });
        children.push(path);

        this.callSuper('initialize', children, options);
    },

    _render: function (ctx) {
        this.callSuper('_render', ctx);
    }
});

export default CounterMarch;