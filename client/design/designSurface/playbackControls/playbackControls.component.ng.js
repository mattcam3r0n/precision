'use strict';

import Audio from '/client/lib/audio/Audio';
import Events from '/client/lib/Events';

angular.module('drillApp')
  .component('playbackControls', {
    templateUrl: 'client/design/designSurface/playbackControls/playbackControls.component.ng.html',
    bindings: {
      drill: '<',
    },
    controller: function($scope, $rootScope, $timeout, appStateService,
                        drillEditorService, eventService) {
      let ctrl = this;

      $scope.tempo = 120;
      $scope.$watch('tempo', function() {
        drillEditorService.setTempo($scope.tempo);
      });

      ctrl.$onInit = function() {
        ctrl.isActivated = true;
        ctrl.subscriptions = eventService.createSubscriptionManager();

        // update position indicator
        ctrl.subscriptions
          .subscribe(Events.positionIndicator, (event, args) => {
            $scope.currentPosition = args.position;
            $rootScope.$safeApply();
          });

        ctrl.subscriptions
          .subscribe(Events.membersSelected, (evt, args) => {
            let msg = '';
            if (args.memberSelection
                && args.memberSelection.members.length > 0) {
              msg = args.memberSelection.members.length + ' selected marchers.';
            }
            $scope.membersSelected = msg;
            $rootScope.$safeApply();
          });
      };

      ctrl.$onDestroy = function() {
        ctrl.subscriptions.unsubscribeAll();
      };

      ctrl.$onChanges = function(changes) {
      };

      ctrl.activate = function() {
      };

      ctrl.deactivate = function() {
      };

      ctrl.onPlay = function(playMusic) {
        Audio.ensureAudioIsInitialized();
        drillEditorService.play(() => {
          $rootScope.$safeApply();
        }, 0, playMusic, ctrl.isMetronomeEnabled);
      };

      ctrl.onStop = function() {
        drillEditorService.stop();
        Audio.stop();
      };

      ctrl.onGoToBeginning = function() {
        drillEditorService.goToBeginning();
      };

      ctrl.onGoToEnd = function() {
        drillEditorService.goToEnd();
      };

      ctrl.onStepBackward = function() {
        drillEditorService.stepBackward();
      };

      ctrl.onStepForward = function() {
        drillEditorService.stepForward();
      };

      // ctrl.metronomeClick = function() {
      //   Audio.ensureAudioIsInitialized();
      //   Audio.playMetronome();
      // };

      // ctrl.zoomIn = function() {
      //   ctrl.timeline.zoomIn();
      // }

      // ctrl.zoomOut = function() {
      //   ctrl.timeline.zoomOut();
      // }

      ctrl.goToBeginning = function() {
        ctrl.timeline.goToBeginning();
      };

      ctrl.goToCurrentCount = function() {
        ctrl.timeline.setCurrentCount(10);
      };

      ctrl.goToEnd = function() {
        ctrl.timeline.goToEnd();
      };

      ctrl.pageForward = function() {
        ctrl.timeline.pageForward();
      };

      ctrl.pageBackward = function() {
        ctrl.timeline.pageBackward();
      };
    },
  });


