
var FileIndicator = fabric.util.createClass(fabric.Group, {
    type: "FileIndicator",

    initialize: function(points, dir, options) {
      options = options || {};
      dir = dir || 90;
      // options.originX = 'right';
      // options.originY = 'top';

      var objects = [];

      var pathExpr = '';
      points.forEach(p => {
        pathExpr += 'L ' + p.x + ' ' + p.y + ' ';
      });
      pathExpr = pathExpr.replace('L', 'M');
      console.log(pathExpr);
      // 'M 60 60 L 120 60 L 120 120 '
      var path = new fabric.Path(pathExpr);
      path.set({ 
        stroke: 'black',
        strokeWidth: 2,
        //strokeDashArray: [1,1],
        fill: false
      });
      objects.push(path);

      var handle = new fabric.Triangle({
        originX: 'center',
        originY: 'center',
        left: points[0].x,
        top: points[0].y,
        width: 7,
        height: 7,
        angle: dir,
        // radius: 3,
        stroke: 'black',
        fill: 'black',
        strokeWidth: 1,
        //strokeDashArray: [3,3],
        //fill: false
      });
      objects.push(handle);

      this.callSuper('initialize', objects, options);
    },

    toObject: function() {
      return fabric.util.object.extend(this.callSuper('toObject'), {
      });
    },
  
    _render: function(ctx) {
      this.callSuper('_render', ctx);
    }
  });

  export default FileIndicator;