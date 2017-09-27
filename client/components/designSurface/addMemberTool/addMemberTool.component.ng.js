'use strict';

angular.module('drillApp')
  .component('addMemberTool', {
    templateUrl: 'client/components/designSurface/addMemberTool/addMemberTool.view.ng.html',
    bindings: {
      field: '<'
    },
    controller: function ($scope, $window) {
      var ctrl = this;

      console.log(ctrl.field);

      createRect(ctrl.field.canvas);
      // angular.element($window).bind('resize', function () {
      //   field.resize();
      // });

      var toolDiv = angular.element('.add-member-tool')[0];

      function positionTools(obj) {
        var absCoords = ctrl.field.getAbsoluteCoords(obj);
        toolDiv.style.left = absCoords.left + 'px';
        toolDiv.style.top = absCoords.top + 'px';
      }

      function createRect(canvas) {
        var rect = new fabric.Rect({
          left: 100,
          top: 100,
          width: 100,
          height: 100,
          fill: 'rgba(0,0,0,0)',
          stroke: 'black',
          strokeWidth: 2,
          strokeDashArray: [5, 5],
          borderColor: 'black',
          cornerColor: 'black',
          transparentCorners: false,
          snapAngle: 45
        });
        canvas.add(rect);

        rect.on('moving', () => { positionTools(rect) });

        return rect;
      }
    }
  });


