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
      drillEditorService, eventService, utilService) {
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
        ctrl.subscriptions.subscribe(Events.bookmarkChanged,
          onBookmarkChanged);
        ctrl.subscriptions.subscribe(Events.tempoChanged, onTempoChanged);
        $('[data-toggle="tooltip"]').tooltip();
      };

      ctrl.$onDestroy = function() {
        ctrl.subscriptions.unsubscribeAll();
      };

      ctrl.$onChanges = function(changes) {
        // if the drill changed, update field
        if (!ctrl.drill) return;
//        ctrl.timeline.setMusicItems(ctrl.drill.music);
        // ctrl.timeline.setItems({
        //   music: ctrl.drill.music,
        //   bookmarks: ctrl.drill.bookmarks,
        // });
        setItems();
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
        utilService.blurActiveElement();
      };

      ctrl.pageBackward = function() {
        ctrl.timeline.pageBackward();
        utilService.blurActiveElement();
      };

      ctrl.chooseMusic = function() {
        eventService.notify(Events.chooseMusicDialogActivated);
      };

      function setItems() {
        updateDrillSchedule();
        ctrl.timeline.setItems({
          music: ctrl.drill.music,
          bookmarks: ctrl.drill.bookmarks,
        });
      }

      function updateDrillSchedule() {
        const schedule = drillEditorService.getDrillSchedule();
        ctrl.timeline.setDrillSchedule(schedule);
      }

      function onAudioClipAdded(evt, args) {
        // ctrl.timeline.setMusicItems(ctrl.drill.music);
        drillEditorService.save(true);
        setItems();
      }

      function onRemove(item) {
        if (item.group == 'music') {
          return removeMusic(item);
        }

        if (item.group == 'bookmarks') {
          return removeBookmark(item);
        }
      }

      function removeMusic(item) {
        let i = ctrl.drill.music.indexOf(item.music);
        ctrl.drill.music.splice(i, 1);
        drillEditorService.save(true);
        setItems();
        return true; // continue removal. return false to cancel.
      }

      function removeBookmark(item) {
        let i = ctrl.drill.bookmarks.indexOf(item.bookmark);
        ctrl.drill.bookmarks.splice(i, 1);
        drillEditorService.save(true);
        return true; // continue removal. return false to cancel.
      }

      function onGoToCount(count) {
        drillEditorService.goToCount(count);
        $scope.$apply();
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

      function onBookmarkChanged(evt, args) {
        setItems();
      }

      function onTempoChanged(evt, args) {
        updateDrillSchedule();
      }

      function onMusicChanged(args) {
        drillEditorService.save(true);
      }

      function zoomTimeline() {
        ctrl.timeline.setWindow(0, 20);
      }
    },
  });


