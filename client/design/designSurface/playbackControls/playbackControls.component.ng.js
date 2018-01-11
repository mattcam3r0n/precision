'use strict';

import Audio from '/client/lib/audio/Audio';


angular.module('drillApp')
  .component('playbackControls', {
    templateUrl: 'client/design/designSurface/playbackControls/playbackControls.component.ng.html',
    bindings: {
      drill: '<'
    },
    controller: function ($scope, $rootScope, $timeout, appStateService, drillEditorService, eventService) {
      var ctrl = this;

      $scope.tempo = 120;
      $scope.$watch('tempo', function () {
        drillEditorService.setTempo($scope.tempo);
      });
      
      ctrl.$onInit = function () {
        ctrl.isActivated = true;

        // update position indicator
        ctrl.unsubscribePositionIndicator = eventService.subscribePositionIndicator((event, args) => {
          $scope.currentPosition = args.position;
          $rootScope.$safeApply();
        });
      }

      ctrl.$onDestroy = function() {
        ctrl.unsubscribePositionIndicator();
      }

      ctrl.$onChanges = function(changes) {
      }

      ctrl.activate = function() {
      }

      ctrl.deactivate = function() {
      }

      ctrl.onPlay = function (playMusic) {
        drillEditorService.play(() => {
          $rootScope.$safeApply();
        }, 0, playMusic);
      }
  
      ctrl.onStop = function () {
        drillEditorService.stop();
        Audio.stop();
      }
  
      ctrl.onGoToBeginning = function () {
        drillEditorService.goToBeginning();
      }
  
      ctrl.onGoToEnd = function () {
        drillEditorService.goToEnd();
      }
  
      ctrl.onStepBackward = function () {
        drillEditorService.stepBackward();
      }
  
      ctrl.onStepForward = function () {
        drillEditorService.stepForward();
      }
        
      
      // ctrl.zoomIn = function() {
      //   ctrl.timeline.zoomIn();
      // }

      // ctrl.zoomOut = function() {
      //   ctrl.timeline.zoomOut();
      // }

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

      // ctrl.chooseMusic = function() {
      //   eventService.notifyChooseMusicDialogActivated();
      // }


    }
  });


