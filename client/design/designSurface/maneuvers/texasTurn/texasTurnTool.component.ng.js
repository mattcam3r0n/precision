'use strict';

import Events from '/client/lib/Events';
import TexasTurn from '../../../../lib/drill/maneuvers/TexasTurn';

angular.module('drillApp').component('texasTurnTool', {
  // eslint-disable-next-line max-len
  templateUrl:
    'client/design/designSurface/maneuvers/texasTurn/texasTurnTool.view.ng.html',
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
        Events.activateTexasTurnTool,
        (evt, args) => {
          activate(drillEditorService.getMemberSelection());
        }
      );

      ctrl.turnDirection = 'right';
    };

    ctrl.$onDestroy = function() {
      ctrl.field = null;
      ctrl.subscriptions.unsubscribeAll();
    };

    ctrl.setTurnDirection = function(dir) {
      ctrl.turnDirection = dir;
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

      appStateService.setActiveTool('texasTurnTool', () => {
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
      const memberSequences = new TexasTurn(members).generate({
        turnDirection: ctrl.turnDirection,
      });
      drillEditorService.previewFootprints(members, memberSequences, 24);
    }

    function deactivate(notify = true) {
      ctrl.subscriptions.unsubscribe(Events.membersSelected);

      ctrl.isActivated = false;
      eventService.notify(Events.clearFootprints);
      eventService.notify(Events.updateField);
      if (notify) {
        eventService.notify(Events.texasTurnToolDeactivated);
      }
    }

    function save() {
      drillEditorService.texasTurn({
        turnDirection: ctrl.turnDirection,
      });

      deactivate();
    }
  },
});
