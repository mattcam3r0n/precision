'use strict';

import Events from '/client/lib/Events';
import Timeline from './Timeline';

angular.module('drillApp')
  .component('timeline', {
    templateUrl: 'client/design/designSurface/timeline/timeline.view.ng.html',
    bindings: {
      drill: '<',
    },
    controller: function($scope, $timeout, appStateService,
                          drillEditorService, eventService) {
      let ctrl = this;

      ctrl.$onInit = function() {
        ctrl.isActivated = true;
        ctrl.subscriptions = eventService.createSubscriptionManager();
        ctrl.timeline = new Timeline('timelineContainer', eventService);
        ctrl.timeline.setOnRemoveCallback(onRemove);
        ctrl.timeline.setOnGoToCountCallback(onGoToCount);
        ctrl.subscriptions.subscribe(Events.audioClipAdded, onAudioClipAdded);
        ctrl.subscriptions.subscribe(Events.drillStateChanged,
                                      onDrillStateChanged);
        ctrl.subscriptions.subscribe(Events.drillOpened,
                                      onDrillOpened);
        ctrl.subscriptions.subscribe(Events.musicChanged,
                                      onMusicChanged);
      };

      ctrl.$onDestroy = function() {
        ctrl.subscriptions.unsubscribeAll();
      };

      ctrl.$onChanges = function(changes) {
        // if the drill changed, update field
        if (!ctrl.drill) return;
        ctrl.timeline.setMusicItems(ctrl.drill.music);
        ctrl.timeline.setCurrentCount(0);
      };

      ctrl.activate = function() {
        ctrl.isActivated = true;
      };

      ctrl.deactivate = function() {
        ctrl.isActivated = false;
      };

      ctrl.zoomIn = function() {
        ctrl.timeline.zoomIn();
      };

      ctrl.zoomOut = function() {
        ctrl.timeline.zoomOut();
      };

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

      ctrl.chooseMusic = function() {
        eventService.notify(Events.chooseMusicDialogActivated);
      };

      function onAudioClipAdded(evt, args) {
        ctrl.timeline.setMusicItems(ctrl.drill.music);
        drillEditorService.save(true);
      }

      function onRemove(item) {
        let i = ctrl.drill.music.indexOf(item.music);
        ctrl.drill.music.splice(i, 1);
        return true; // continue removal. return false to cancel.
      }

      function onGoToCount(count) {
        drillEditorService.goToCount(count);
      }

      function onDrillStateChanged(evt, args) {
        if (!ctrl.drill) {
          ctrl.timeline.setCurrentCount(0);
          return;
        }

        if (!ctrl.timeline.isCountVisible(ctrl.drill.count)) {
          let range = ctrl.timeline.getVisibleCountRange();
          let midpoint = Math.floor((range.end - range.start) / 2);
          let count = ctrl.drill.count + midpoint - 1;
          ctrl.timeline.moveTo(count);
        }
        ctrl.timeline.setCurrentCount(ctrl.drill.count);
      }

      function onDrillOpened(evt, args) {
        zoomTimeline();
      }

      function onMusicChanged(args) {
        drillEditorService.save(true);
      }

      function zoomTimeline() {
        ctrl.timeline.setWindow(0, 20);
      }
    },
  });


