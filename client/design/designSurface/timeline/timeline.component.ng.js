'use strict';

import Timeline from './Timeline';

angular.module('drillApp')
  .component('timeline', {
    templateUrl: 'client/design/designSurface/timeline/timeline.view.ng.html',
    bindings: {
      field: '<'
    },
    controller: function ($scope, drillEditorService, eventService) {
      var ctrl = this;

      ctrl.$onInit = function () {
        ctrl.isActivated = true;
        ctrl.timeline = new Timeline('timelineContainer');
      }

      ctrl.zoomIn = function() {
        ctrl.timeline.timeline.zoomIn(0.5);
      }

      ctrl.zoomOut = function() {
        ctrl.timeline.timeline.zoomOut(0.5);        
      }

      ctrl.goToBeginning = function() {
        ctrl.timeline.timeline.moveTo(new Date(0));
      }

      ctrl.goToEnd = function() {

      }

      ctrl.pageForward = function() {
        move(-0.9);        
      }

      ctrl.pageBackward = function() {
        move(0.9);
      }

      function move (percentage) {
        var range = ctrl.timeline.timeline.getWindow();
        var interval = range.end - range.start;

        ctrl.timeline.timeline.setWindow({
            start: range.start.valueOf() - interval * percentage,
            end:   range.end.valueOf()   - interval * percentage
        });
    
      }
    }
  });


