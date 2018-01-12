'use strict';

import Timeline from './Timeline';

angular.module('drillApp')
  .component('timeline', {
    templateUrl: 'client/design/designSurface/timeline/timeline.view.ng.html',
    bindings: {
      drill: '<'
    },
    controller: function ($scope, $timeout, appStateService, drillEditorService, eventService) {
      var ctrl = this;

      ctrl.$onInit = function () {
        ctrl.isActivated = true;
        ctrl.timeline = new Timeline('timelineContainer');
        ctrl.timeline.setOnRemoveCallback(onRemove);
        ctrl.timeline.setOnGoToCountCallback(onGoToCount);
        ctrl.unsubscribeAudioClipAdded = eventService.subscribeAudioClipAdded(onAudioClipAdded);
        ctrl.unsubscribeShowTimeline = eventService.subscribeShowTimeline(ctrl.activate);
        ctrl.unsubscribeDrillStateChanged = drillEditorService.subscribeDrillStateChanged(onDrillStateChanged);
      }

      ctrl.$onDestroy = function() {
        ctrl.unsubscribeAudioClipAdded();
        ctrl.unsubscribeShowTimeline();
        ctrl.unsubscribeDrillStateChanged();
      }

      ctrl.$onChanges = function(changes) {
        // if the drill changed, update field
        if (!ctrl.drill) return;
        ctrl.timeline.setMusicItems(ctrl.drill.music);
      }

      ctrl.activate = function() {
        ctrl.isActivated = true;

        $timeout(() => {
          ctrl.timeline.zoomToCount(ctrl.drill.count);
        }, 500);
      }

      ctrl.deactivate = function() {
        ctrl.isActivated = false;
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

      function onAudioClipAdded(evt, args) {
        ctrl.timeline.setMusicItems(ctrl.drill.music);
        drillEditorService.save(true);
      }

      function onRemove(item) {
        var i = ctrl.drill.music.indexOf(item.music);
        ctrl.drill.music.splice(i, 1);
        return true; // continue removal. return false to cancel.
      }

      function onGoToCount(count) {
        drillEditorService.goToCount(count);
      }

      function onDrillStateChanged(args) {
        if (!ctrl.drill){
          ctrl.timeline.setCurrentCount(0);
          return;
        }
        
        if (!ctrl.timeline.isCountVisible(ctrl.drill.count)) {
          var range = ctrl.timeline.getVisibleCountRange();
          var midpoint = Math.floor((range.end - range.start) / 2);
          var count = ctrl.drill.count + midpoint - 1;
          ctrl.timeline.moveTo(count);
        }
        ctrl.timeline.setCurrentCount(ctrl.drill.count);
      }

    }
  });


