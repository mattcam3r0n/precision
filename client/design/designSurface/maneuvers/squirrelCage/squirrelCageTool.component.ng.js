'use strict';

import Events from '/client/lib/Events';
import SquirrelCage from '/client/lib/drill/maneuvers/SquirrelCage';
import Block from '../../../../lib/drill/Block';

angular.module('drillApp').component('squirrelCageTool', {
  // eslint-disable-next-line max-len
  templateUrl:
    'client/design/designSurface/maneuvers/squirrelCage/squirrelCageTool.view.ng.html',
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
        Events.activateSquirrelCageTool,
        (evt, args) => {
          activate(drillEditorService.getMemberSelection());
        }
      );

      ctrl.clockwise = true;
      ctrl.counts = 24;
      ctrl.alternateDirection = false;
    };

    ctrl.$onDestroy = function() {
      ctrl.field = null;
      ctrl.subscriptions.unsubscribeAll();
    };

    ctrl.setClockwise = function(isClockwise) {
      if (isClockwise != null) {
        ctrl.clockwise = isClockwise;
      }
      activate(drillEditorService.getMemberSelection());
    };

    ctrl.setAlternateDirection = function(shouldAlternate) {
      if (shouldAlternate != null) {
        ctrl.alternateDirection = shouldAlternate;
      }
      activate(drillEditorService.getMemberSelection());
    };

    ctrl.setCounts = function(counts) {
      if (counts != null) {
        ctrl.counts = counts;
      }
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

      appStateService.setActiveTool('squirrelCageTool', () => {
        deactivate(false);
      });

      ctrl.isActivated = true;
      ctrl.memberSelection = memberSelection;
      alertIfNoSelection();
      ctrl.block = new Block(ctrl.memberSelection.members);
      ctrl.subscriptions.subscribe(Events.membersSelected, (evt, args) => {
        if (!ctrl.isActivated) return;
        ctrl.memberSelection = drillEditorService.getMemberSelection();
        ctrl.block = new Block(ctrl.memberSelection.members);
        eventService.notify(Events.drillStateChanged);
        activate(ctrl.memberSelection);
      });
      previewFootprints();
    }

    function previewFootprints() {
      alertIfNoSelection();
      const members = ctrl.memberSelection.members;
      const memberSequences = new SquirrelCage(members).generate(getOptions());
      drillEditorService.previewFootprints(members, memberSequences, 24);
    }

    function alertIfNoSelection() {
      if (!ctrl.memberSelection || ctrl.memberSelection.length == 0) {
        alertService.info('You must select a block to work with.');
        return;
      }
    }

    function deactivate(notify = true) {
      ctrl.subscriptions.unsubscribe(Events.membersSelected);

      ctrl.isActivated = false;
      eventService.notify(Events.clearFootprints);
      eventService.notify(Events.updateField);
      if (notify) {
        eventService.notify(Events.squirrelCageToolDeactivated);
      }
    }

    function save() {
      drillEditorService.squirrelCage(getOptions());

      deactivate();
    }

    function getOptions() {
      return {
        counts: ctrl.counts,
        clockwise: ctrl.clockwise,
        alternateRingDirection: ctrl.alternateDirection,
      };
    }
  },
});
