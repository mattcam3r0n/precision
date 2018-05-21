'use strict';

import Events from '/client/lib/Events';
import Countermarch from '../../../../lib/drill/maneuvers/Countermarch';

angular.module('drillApp').component('countermarchTool', {
  // eslint-disable-next-line max-len
  templateUrl:
    'client/design/designSurface/maneuvers/countermarch/countermarchTool.view.ng.html',
  bindings: {},
  controller: function(
    $scope,
    $window,
    appStateService,
    drillEditorService,
    eventService
  ) {
    let ctrl = this;

    ctrl.$onInit = function() {
      $('[data-toggle="tooltip"]').tooltip();

      ctrl.subscriptions = eventService.createSubscriptionManager();

      ctrl.subscriptions.subscribe(
        Events.activateCountermarchTool,
        (evt, args) => {
          activate(drillEditorService.getMemberSelection());
        }
      );

      ctrl.countermarchDirection = 'left';
      ctrl.fileDelayDirection = 'left-to-right';
      ctrl.fileDelay = 0;
      ctrl.rankDelay = 0;
    };

    ctrl.$onDestroy = function() {
      ctrl.field = null;
      ctrl.subscriptions.unsubscribeAll();
    };

    $scope.save = function() {
      save();
      deactivate();
    };

    ctrl.setCountermarchDirection = function(dir) {
      ctrl.countermarchDirection = dir;
      drillEditorService.blurActiveElement();
    };

    ctrl.setFileDelay = function(counts) {
      ctrl.fileDelay = counts;
    };

    ctrl.setFileDelayDirection = function(dir) {
      ctrl.fileDelayDirection = dir;
      drillEditorService.blurActiveElement();
    };

    ctrl.setRankDelay = function(counts) {
      ctrl.rankDelay = counts;
    };

    $scope.cancel = deactivate;

    function activate(memberSelection) {
      if (ctrl.isActivated) {
        deactivate();
      }

      appStateService.setActiveTool('countermarchTool', () => {
        deactivate(false);
      });

      ctrl.isActivated = true;
      ctrl.memberSelection = memberSelection;
      ctrl.strideType = drillEditorService.strideType;
      ctrl.subscriptions.subscribe(Events.membersSelected, (evt, args) => {
        if (!ctrl.isActivated) return;
        ctrl.memberSelection = drillEditorService.getMemberSelection();
        eventService.notify(Events.drillStateChanged);
      });
      previewFootprints();
    }

    function previewFootprints() {
      const members = ctrl.memberSelection.members;
      const memberSequences = new Countermarch(members).generate(
        getCountermarchOptions()
      );
      drillEditorService.previewFootprints(members, memberSequences, 24);
    }

    function deactivate(notify = true) {
      ctrl.subscriptions.unsubscribe(Events.membersSelected);

      ctrl.isActivated = false;
      eventService.notify(Events.clearFootprints);
      eventService.notify(Events.updateField);
      if (notify) {
        eventService.notify(Events.countermarchToolDeactivated);
      }
    }

    function getCountermarchOptions() {
      return {
        countermarchDirection: ctrl.countermarchDirection,
        fileDelayDirection: ctrl.fileDelayDirection,
        fileDelay: ctrl.fileDelay,
        rankDelay: ctrl.rankDelay,
      };
    }

    function save() {
      drillEditorService.countermarch({
        countermarchDirection: ctrl.countermarchDirection,
        fileDelay: ctrl.fileDelay,
        fileDelayDirection: ctrl.fileDelayDirection,
        rankDelay: ctrl.rankDelay,
      });

      deactivate();
    }
  },
});
