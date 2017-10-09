
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
        this.set('height', this.height + 4);
        this.set('width', this.width + 4);
        this.set('strokeWidth', 2);
      });

      this.on('mouseout', function() {
        this.set('height', this.height - 4);
        this.set('width', this.width - 4);          
        this.set('strokeWidth', 1);
      });

      // this.on('selected', function() {
      //   this.set('stroke', 'yellow');
      // });
      // this.on('deselected', function() {
      //   this.set('stroke', 'black');
      // });
    },

    _render: function(ctx) {
        this.callSuper('_render', ctx);
    }
  });

  export default Marcher;