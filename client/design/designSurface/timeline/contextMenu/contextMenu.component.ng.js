'use strict';
import Events from '/client/lib/Events';

angular.module('drillApp').component('timelineContextMenu', {
  templateUrl:
    'client/design/designSurface/timeline/contextMenu/contextMenu.component.ng.html',
  bindings: {},
  require: {
    parent: '^^timeline',
  },
  controller: function(
    $scope,
    $rootScope,
    $document,
    confirmationDialogService,
    drillEditorService,
    eventService
  ) {
    let ctrl = this;

    ctrl.$onInit = function() {
      ctrl.isActivated = false;
      ctrl.subscriptions = eventService.createSubscriptionManager();

      ctrl.subscriptions.subscribe(
        Events.showTimelineContextMenu,
        (evt, args) => {
          activate(args);
        }
      );

      $document.click((evt) => {
        deactivate();
      });
      // $('body').mousedown((evt)=> {
      //   console.log(evt);
      //   if (evt.target.nodeName != 'A') {
      //     deactivate();
      //   }
      // });
    };

    ctrl.$onDestroy = function() {};

    $scope.activate = activate;

    $scope.deactivate = function() {};

    $scope.cancel = deactivate;

    ctrl.showTrackOptions = function() {
      return ctrl.item && ctrl.item.music && ctrl.item.music.type != 'tempo'
        ? true
        : false;
    };

    ctrl.splitTrack = function() {
      if (!ctrl.item || !ctrl.item.music) return;
      drillEditorService.splitTrack(ctrl.count, ctrl.item.music);
    };

    ctrl.deleteTrack = function() {
      if (!ctrl.item || !ctrl.item.music) return;
      ctrl.parent.removeMusic(ctrl.item);
    };

    ctrl.addTempo = function() {
      drillEditorService.addTempo();
    };

    ctrl.addMusic = function() {
      drillEditorService.addMusic();
    };

    ctrl.zoomIn = function() {
      ctrl.parent.zoomIn();
    };

    ctrl.zoomOut = function() {
      ctrl.parent.zoomOut();
    };

    function activate(args) {
      if (ctrl.isActivated) {
        deactivate();
      }

      ctrl.isActivated = true;
      ctrl.item = args.item;
      ctrl.count = args.count;
      $('div.timeline-context-menu').css({
        top: args.point.top,
        left: args.point.left,
      });
      $('div.timeline-context-menu div.dropdown').addClass('open');
      $rootScope.$safeApply();
    }

    function deactivate() {
      ctrl.isActivated = false;
      $('div.timeline-context-menu div.dropdown').removeClass('open');
    }
  },
});
