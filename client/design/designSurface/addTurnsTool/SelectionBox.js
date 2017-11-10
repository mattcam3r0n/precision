
var SelectionBox = fabric.util.createClass(fabric.Rect, {
    type: "SelectionBox",
    // cosider center of object the origin. eg, rotate around center.
    originX: 'left',
    originY: 'top',
    angle: 0,
    cornerStyle: 'circle',
    transparentCorners: false,
    fill: false,
    stroke: 'black',
    strokeWidth: 1,
    height: 100,
    width: 100,      

    initialize: function (options) {
        options = options || {};
        var self = this;

        options.selectable = false;
        options.evented = false;
        
        this.callSuper('initialize', options);

        this.setControlsVisibility({
            tl: false,
            tm: false,
            tr: false,
            ml: false,
            mr: false,
            mb: false,
            mt: false,
            bl: false,
            br: false,
            mtr: false
        });

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

export default SelectionBox;