'use strict';


angular.module('drillApp')
  .component('playbackControls', {
    templateUrl: 'client/design/designSurface/playbackControls/playbackControls.component.ng.html',
    bindings: {
      drill: '<'
    },
    controller: function ($scope, $timeout, appStateService, drillEditorService, eventService) {
      var ctrl = this;

      ctrl.$onInit = function () {
        ctrl.isActivated = true;
      }

      ctrl.$onDestroy = function() {
      }

      ctrl.$onChanges = function(changes) {
      }

      ctrl.activate = function() {
      }

      ctrl.deactivate = function() {
      }
      
      ctrl.zoomIn = function() {
        ctrl.timeline.zoomIn();
      }

      ctrl.zoomOut = function() {
        ctrl.timeline.zoomOut();
      }

      ctrl.goToBeginning = function() {
        ctrl.timeline.goToBeginning();
      }

      ctrl.goToCurrentCount = function() {
        ctrl.timeline.setCurrentCount(10);
      }

      ctrl.goToEnd = function() {
        ctrl.timeline.goToEnd();
      }

      ctrl.pageForward = function() {
        ctrl.timeline.pageForward();
      }

      ctrl.pageBackward = function() {
        ctrl.timeline.pageBackward();
      }

      ctrl.chooseMusic = function() {
        eventService.notifyChooseMusicDialogActivated();
      }


    }
  });


