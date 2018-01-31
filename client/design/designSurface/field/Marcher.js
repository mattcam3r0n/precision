import FieldDimensions from '/client/lib/FieldDimensions';
import StepType from '/client/lib/StepType';

let Marcher = fabric.util.createClass(fabric.Triangle, {
  type: 'Marcher',
  // cosider center of object the origin. eg, rotate around center.
  originX: 'center',
  originY: 'center',
  fill: 'red',
  stroke: 'black',
  hasControls: false,
  lockMovementX: true,
  lockMovementY: true,
  hoverCursor: 'pointer',

  initialize: function(options) {
    this.callSuper('initialize', options);

    /* eslint-disable no-invalid-this */
    this.on('mouseover', function() {
      if (this.member && !this.member.isVisible) return;

      this.set('height', FieldDimensions.marcherHeight + 2);
      this.set('width', FieldDimensions.marcherWidth + 2);
      this.set('strokeWidth', 2);
    });

    this.on('mouseout', function() {
      if (this.member && !this.member.isVisible) return;

      this.set('height', FieldDimensions.marcherHeight); // this.height - 4);
      this.set('width', FieldDimensions.marcherWidth); // this.width - 4);
      this.set('strokeWidth', 1);
    });
    /* eslint-enable */
  },

  update: function(state) {
    // set position and direction
    this.setPosition(state.x, state.y, state.direction);

    // set selection
    this.setSize(state);
    this.setSelection(state.isSelected);
    this.setVisible(state.isVisible);
    this.setOpacity(state);
  },

  setOpacity: function(state) {
    if (!state.isVisible) return;

    if (state.stepType == StepType.Halt) {
      this.set('opacity', state.count % 2 == 0 ? .7 : .8 );
      return;
    }

    this.set('opacity', 1);
  },

  setSize: function(state) {
    if ((state.stepType == StepType.MarkTime
      || state.stepType == StepType.DeadStep
      || state.stepType == StepType.FaceStep)
      && state.count % 2 == 1) {
      this.set('height', FieldDimensions.marcherHeight + 2);
      this.set('width', FieldDimensions.marcherWidth + 2);
      return;
    }

    this.set('height', FieldDimensions.marcherHeight);
    this.set('width', FieldDimensions.marcherWidth);
  },

  setPosition: function(x, y, dir) {
    this.set('left', x);
    this.set('top', y);
    this.set('angle', dir);
  },

  setSelection: function(isSelected) {
    this.set('stroke', isSelected ? 'yellow' : 'black');
  },

  setVisible: function(isVisible) {
    isVisible = isVisible === undefined ? true : isVisible;
    this.set('opacity', isVisible ? 1 : .2);
    this.set('selectable', isVisible ? true : false);
    this.set('evented', isVisible ? true : false);
  },

  _render: function(ctx) {
    this.callSuper('_render', ctx);
  },
});

export default Marcher;
