'use strict';

import Events from '/client/lib/Events';
import FastBreak from '/client/lib/drill/maneuvers/FastBreak';

angular.module('drillApp').component('fastBreakTool', {
  // eslint-disable-next-line max-len
  templateUrl:
    'client/design/designSurface/maneuvers/fastBreak/fastBreakTool.view.ng.html',
  bindings: {},
  controller: function(
    $scope,
    appStateService,
    drillEditorService,
    alertService,
    eventService
  ) {
    let ctrl = this;

    ctrl.$onInit = function() {
      ctrl.isActivated = false;
      ctrl.subscriptions = eventService.createSubscriptionManager();

      ctrl.subscriptions.subscribe(
        Events.activateFastBreakTool,
        (evt, args) => {
          activate(drillEditorService.getMemberSelection());
        }
      );
      ctrl.fileDelayDirection = 'left-to-right';
      $scope.$watch('$ctrl.fileDelayDirection', ctrl.onOptionChanged);
    };

    ctrl.onOptionChanged = function() {
      previewFootprints();
    };

    ctrl.$onDestroy = function() {
      ctrl.field = null;
      ctrl.subscriptions.unsubscribeAll();
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

      appStateService.setActiveTool('fastBreakTool', () => {
        deactivate(false);
      });

      ctrl.isActivated = true;
      ctrl.memberSelection = memberSelection;
      // alertIfNoSelection();
      ctrl.subscriptions.subscribe(Events.membersSelected, (evt, args) => {
        if (!ctrl.isActivated) return;
        ctrl.memberSelection = drillEditorService.getMemberSelection();
        // ctrl.block = new Block(ctrl.memberSelection.members);
        eventService.notify(Events.drillStateChanged);
        activate(ctrl.memberSelection);
      });
      // ctrl.block = new Block(ctrl.memberSelection.members);
      previewFootprints();
    }

    function previewFootprints() {
      if (!ctrl.isActivated) {
        return;
      }
      if (hasNoSelection()) {
        alertNoSelection();
        return;
      }
      const members = ctrl.memberSelection.members;
      const memberSequences = new FastBreak(members).generate(getOptions());
      drillEditorService.previewFootprints(members, memberSequences, 24);
    }

    function hasNoSelection() {
      return !ctrl.memberSelection || ctrl.memberSelection.length == 0;
    }

    function alertNoSelection() {
      alertService.info('You must select a block to work with.');
    }

    function deactivate(notify = true) {
      ctrl.subscriptions.unsubscribe(Events.membersSelected);

      ctrl.isActivated = false;
      eventService.notify(Events.clearFootprints);
      eventService.notify(Events.updateField);
      if (notify) {
        eventService.notify(Events.fastBreakToolDeactivated);
      }
    }

    function save() {
      drillEditorService.fastBreak(getOptions());

      deactivate();
    }

    function getOptions() {
      return {
        fileDelayDirection: ctrl.fileDelayDirection,
      };
    }
  },
});
