import FieldDimensions from '/client/lib/FieldDimensions';
import Direction from '/client/lib/Direction';
import StrideType from '/client/lib/StrideType';

// line dir, turn dir
var rotationMap = {
    [Direction.N]: {
        [Direction.W]: {
            angle: 90,
            flipX: false,
            flipY: true
        },
        [Direction.E]: {
            angle: 90,
            flipX: true,
            flipY: true            
        },
        [Direction.S]: {
            angle: 0,
            flipX: false,
            flipY: false            
        },
        [Direction.N]: {
            angle: 0,
            flipX: false,
            flipY: false            
        }
    },
    [Direction.S]: {
        [Direction.W]: {
            angle: 90,
            flipX: false,
            flipY: false
        },
        [Direction.E]: {
            angle: 90,
            flipX: false,
            flipY: true
        },
        [Direction.S]: {
            angle: 0,
            flipX: false,
            flipY: false            
        },
        [Direction.N]: {
            angle: 0,
            flipX: false,
            flipY: false            
        }
    },
    [Direction.E]: {
        [Direction.W]: {
            angle: 90,
            flipX: false,
            flipY: false
        },
        [Direction.E]: {
            angle: 270,
            flipX: false,
            flipY: true            
        },
        [Direction.S]: {
            angle: 0,
            flipX: false,
            flipY: false            
        },
        [Direction.N]: {
            angle: 0,
            flipX: false,
            flipY: false            
        }
    },
    [Direction.W]: {
        [Direction.W]: {
            angle: 90,
            flipX: false,
            flipY: false
        },
        [Direction.E]: {
            angle: 270,
            flipX: false,
            flipY: true            
        },
        [Direction.S]: {
            angle: 0,
            flipX: true,
            flipY: false            
        },
        [Direction.N]: {
            angle: 0,
            flipX: true,
            flipY: true            
        }
    },
};


var TurnMarker = fabric.util.createClass(fabric.Group, {
    type: "TurnMarker",
    // cosider center of object the origin. eg, rotate around center.
    originX: 'center',
    originY: 'center',
    angle: 0,
    // left: fieldPoint.x,
    // top: fieldPoint.y,
    // angle: initialState.direction, // angle of object. correspond to direction.
    hasControls: false,
    // lockMovementX: true,
    // lockMovementY: true,
    // hoverCursor: 'pointer',

    initialize: function (turnDir, lineDir, options) {
        options = options || {};
        var self = this;
        var children = [];

        var rotation = rotationMap[lineDir][turnDir];
    console.log(lineDir, turnDir, rotation);
        options.angle = rotation.angle;
        options.flipX = rotation.flipX;
        options.flipY = rotation.flipY;

        var rect = new fabric.Rect({
            fill: false,
//             stroke: 'black',
            stroke: 'rgba(0,0,0,0)',
            strokeWidth: 1,
            height: 30,
            width: 30            
        });
        children.push(rect);
        // var pathExpr = "M 0 0 L 20 0";
        // var path = new fabric.Path(pathExpr, {
        //     fill: false,
        //     stroke: 'rgba(0,0,0,0)',
        //     strokeWidth: 5,
        // });
        // children.push(path);

        var pathExpr = "M 0 15 L 15 15 L 15 30 M 15 30 L 10 20 M 15 30 L 20 20";
        var path = new fabric.Path(pathExpr, {
            fill: false,
            stroke: 'black',
            strokeWidth: 2,
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