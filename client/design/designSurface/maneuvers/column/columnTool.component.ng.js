'use strict';

import Events from '/client/lib/Events';
import Column from '../../../../lib/drill/maneuvers/Column';

angular.module('drillApp').component('columnTool', {
  // eslint-disable-next-line max-len
  templateUrl:
    'client/design/designSurface/maneuvers/column/columnTool.view.ng.html',
  bindings: {},
  controller: function(
    $scope,
    $window,
    appStateService,
    drillEditorService,
    alertService,
    eventService
  ) {
    let ctrl = this;

    ctrl.$onInit = function() {
      ctrl.subscriptions = eventService.createSubscriptionManager();

      ctrl.subscriptions.subscribe(
        Events.activateColumnTool,
        (evt, args) => {
          activate(drillEditorService.getMemberSelection());
        }
      );

      ctrl.turnDirection = 'right';
      ctrl.fileDelay = 2;
    };

    ctrl.$onDestroy = function() {
      ctrl.field = null;
      ctrl.subscriptions.unsubscribeAll();
    };

    ctrl.setTurnDirection = function(dir) {
      ctrl.turnDirection = dir;
      activate(drillEditorService.getMemberSelection());
    };

    ctrl.setFileDelay = function(delay) {
      ctrl.fileDelay = delay;
      activate(drillEditorService.getMemberSelection());
    };

    $scope.save = function() {
      save();
      deactivate();
    };

    $scope.cancel = deactivate;

    function activate(memberSelection) {
      if (ctrl.isActivated) {
        deactivate();
      }

      appStateService.setActiveTool('columnTool', () => {
        deactivate(false);
      });

      ctrl.isActivated = true;
      ctrl.memberSelection = memberSelection;
      ctrl.strideType = drillEditorService.strideType;
      ctrl.subscriptions.subscribe(Events.membersSelected, (evt, args) => {
        if (!ctrl.isActivated) return;
        ctrl.memberSelection = drillEditorService.getMemberSelection();
        eventService.notify(Events.drillStateChanged);
        activate(ctrl.memberSelection);
      });
      previewFootprints();
    }

    function previewFootprints() {
      if (!ctrl.memberSelection || ctrl.memberSelection.length == 0) {
        alertService.info('You must select a block to work with.');
        return;
      }
      const members = ctrl.memberSelection.members;
      const memberSequences = new Column(members).generate(getOptions());
      drillEditorService.previewFootprints(members, memberSequences, 24);
    }

    function deactivate(notify = true) {
      ctrl.subscriptions.unsubscribe(Events.membersSelected);

      ctrl.isActivated = false;
      eventService.notify(Events.clearFootprints);
      eventService.notify(Events.updateField);
      if (notify) {
        eventService.notify(Events.columnToolDeactivated);
      }
    }

    function save() {
      drillEditorService.column(getOptions());

      deactivate();
    }

    function getOptions() {
      return {
        turnDirection: ctrl.turnDirection || 'right',
        fileDelay: ctrl.fileDelay || 2,
      };
    }
  },
});
