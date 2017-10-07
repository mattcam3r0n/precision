
var Marcher = fabric.util.createClass(fabric.Triangle, {
    type: "marcher",
    // cosider center of object the origin. eg, rotate around center.
    originX: 'center',
    originY: 'center',
    // width: FieldDimensions.marcherWidth,
    // height: FieldDimensions.marcherHeight,
    fill: 'red',
    stroke: 'black',
    // left: fieldPoint.x,
    // top: fieldPoint.y,
    // angle: initialState.direction, // angle of object. correspond to direction.
    hasControls: false,
    lockMovementX: true,
    lockMovementY: true,
    hoverCursor: 'pointer',

    initialize: function(options) {
      this.callSuper('initialize', options);
      this.on('mouseover', function() {
        this.set('height', this.height + 3);
        this.set('width', this.width + 3);
        this.set('stroke', 'yellow');
      });
      this.on('mouseout', function() {
        this.set('height', this.height - 3);
        this.set('width', this.width - 3);          
        this.set('stroke', 'black');
      })
    },

    _render: function(ctx) {
        this.callSuper('_render', ctx);
    }
  });

  export default Marcher;