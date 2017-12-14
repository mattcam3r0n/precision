'use strict';

import Timeline from './Timeline';

angular.module('drillApp')
  .component('timeline', {
    templateUrl: 'client/design/designSurface/timeline/timeline.view.ng.html',
    bindings: {
      drill: '<'
    },
    controller: function ($scope, appStateService, eventService) {
      var ctrl = this;

      ctrl.$onInit = function () {
        ctrl.isActivated = true;
        ctrl.timeline = new Timeline('timelineContainer');
        ctrl.unsubscribeAudioClipAdded = eventService.subscribeAudioClipAdded(onAudioClipAdded);
      }

      ctrl.$onDestroy = function() {
        ctrl.unsubscribeAudioClipAdded();
      }

      ctrl.$onChanges = function(changes) {
        // if the drill changed, update field
        if (!ctrl.drill) return;
        ctrl.timeline.setMusicItems(ctrl.drill.music);
        ctrl.timeline.goToBeginning();
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

      function onAudioClipAdded(evt, args) {
        ctrl.timeline.setMusicItems(ctrl.drill.music);
      }

    }
  });


