
const Footprint = fabric.util.createClass(fabric.Circle, {
  type: 'Footprint',
  originX: 'center',
  originY: 'center',
  radius: 2,
  fill: 'black',
  stroke: 'black',
  opacity: 0.5,
  evented: false,
  selectable: false,

  initialize: function(options) {
    const defaultOptions = {
      radius: 2,
    };
    options = Object.assign(defaultOptions, options);
    this.callSuper('initialize', options);
  },

  _render: function(ctx) {
    this.callSuper('_render', ctx);
  },
});

export default Footprint;
