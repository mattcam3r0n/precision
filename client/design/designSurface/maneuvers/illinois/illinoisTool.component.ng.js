'use strict';

import Events from '/client/lib/Events';
import Illinois from '../../../../lib/drill/maneuvers/Illinois';

angular.module('drillApp').component('illinoisTool', {
  // eslint-disable-next-line max-len
  templateUrl:
    'client/design/designSurface/maneuvers/illinois/illinoisTool.view.ng.html',
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
        Events.activateIllinoisTool,
        (evt, args) => {
          activate(drillEditorService.getMemberSelection());
        }
      );
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

      appStateService.setActiveTool('illinoisTool', () => {
        deactivate(false);
      });

      ctrl.isActivated = true;
      ctrl.memberSelection = memberSelection;
      ctrl.strideType = drillEditorService.strideType;
      ctrl.subscriptions.subscribe(Events.membersSelected, (evt, args) => {
        if (!ctrl.isActivated) return;
        ctrl.memberSelection = drillEditorService.getMemberSelection();
        activate(ctrl.memberSelection);
        eventService.notify(Events.drillStateChanged);
      });
      previewFootprints();
    }

    function previewFootprints() {
      if (!ctrl.memberSelection || ctrl.memberSelection.length == 0) {
        alertService.info('You must select a block to work with.');
        return;
      }
      const members = ctrl.memberSelection.members;
      const memberSequences = new Illinois(members).generate();
      drillEditorService.previewFootprints(members, memberSequences, 24);
    }

    function deactivate(notify = true) {
      ctrl.subscriptions.unsubscribe(Events.membersSelected);

      ctrl.isActivated = false;
      eventService.notify(Events.clearFootprints);
      eventService.notify(Events.updateField);
      if (notify) {
        eventService.notify(Events.illinoisToolDeactivated);
      }
    }

    function save() {
      drillEditorService.illinois();

      deactivate();
    }
  },
});
