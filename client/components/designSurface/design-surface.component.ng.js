'use strict';

angular.module('drillApp')
  .component('designSurface', {
    templateUrl: 'client/components/designSurface/design-surface.view.ng.html',
    controller: function ($scope, $window) {
      var ctrl = this;

      // create a wrapper around native canvas element (with id="c")
      var size = getSize();
      var canvas = new fabric.Canvas('design-surface', {
        backgroundColor: 'green',
        height: 780,
        width: 1560
      });

      // create a rectangle object
      var rect = new fabric.Rect({
        left: 10,
        top: 10,
        fill: 'red',
        width: 10,
        height: 10,
        cornerColor: 'black',
        transparentCorners: false,
        cornerSize: 8
      });

      var triangle = new fabric.Triangle({
        width: 10, 
        height: 10, 
        fill: 'blue', 
        left: 5, 
        top: 5, 
        cornerColor: 'black',
        borderColor: 'black',
        cornerStyle: 'circle',
        borderDashArray: [3,3]
      });

      // "add" rectangle onto canvas
      canvas.add(rect, triangle);

      angular.element($window).bind('resize', function () {
        resizeCanvas(canvas);
      });
    }
  });

function resizeCanvas(canvas) {
  var size = getSize();
  // canvas.setHeight(size.height);
  // canvas.setWidth(size.width);
  canvas.setDimensions({ height: size.height + 'px', width: size.width + 'px' }, { cssOnly: true });
  canvas.renderAll();
}

function getSize() {
  var parentEl = angular.element('.design-surface')[0];
  var size = {
    height: parentEl.clientWidth * .5,
    width: parentEl.clientWidth
  };
  return size;
}

