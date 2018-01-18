// start in radians 0PI = N, .5PI = E, 1PI = S, 1.5PI = W
// rotation: 1/4 = .5PI
// start + rotation
let PivotPoint = fabric.util.createClass(fabric.Circle, {
  type: 'PathArc',
  // cosider center of object the origin. eg, rotate around center.
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

  initialize: function(pivotPoint, radius, startAngle, endAngle) {
    options = {};

    options.radius = radius;
    options.left = pivotPoint.x;
    options.top = pivotPoint.y;
    options.startAngle = startAngle;
    options.endAngle = endAngle;

    this.callSuper('initialize', options);
  },

  _render: function(ctx) {
    this.callSuper('_render', ctx);
  },
});

export default PivotPoint;
