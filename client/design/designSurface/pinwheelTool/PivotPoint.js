import FieldDimensions from '/client/lib/FieldDimensions';

let PivotPoint = fabric.util.createClass(fabric.Circle, {
  type: 'PivotPoint',
  // cosider center of object the origin. eg, rotate around center.
  originX: 'center',
  originY: 'center',
  fill: false,
  stroke: 'black',
  hasControls: false,
  lockMovementX: true,
  lockMovementY: true,
  hoverCursor: 'pointer',

  initialize: function(pivotPoint) {
    options = {};

    options.radius = FieldDimensions.marcherWidth * .75;
    options.left = pivotPoint.x,
    options.top = pivotPoint.y,
    options.stroke = 'white';
    options.strokeWidth = 1;
    options.fill = '';

    this.callSuper('initialize', options);
  },

  _render: function(ctx) {
    this.callSuper('_render', ctx);
  },
});

export default PivotPoint;
