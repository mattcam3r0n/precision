'use strict';

import Events from '/client/lib/Events';
import Column from '../../../../lib/drill/maneuvers/Column';
import Block from '../../../../lib/drill/Block';
import MemberPosition from '../../../../lib/drill/MemberPosition';

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

      ctrl.subscriptions.subscribe(Events.activateColumnTool, (evt, args) => {
        activate(drillEditorService.getMemberSelection());
      });

      ctrl.turnDirection = 'right';
      ctrl.fileDelay = 2;
    };

    ctrl.$onDestroy = function() {
      ctrl.field = null;
      ctrl.subscriptions.unsubscribeAll();
    };

    ctrl.setTurnDirection = function(dir) {
      ctrl.turnDirection = dir;
      activate(drillEditorService.getMemberSelection(), dir);
    };

    ctrl.setFileDelay = function(delay) {
      if (delay != null) {
        ctrl.fileDelay = delay;
      }
      activate(drillEditorService.getMemberSelection());
    };

    ctrl.setReverseFlag = function() {
      activate(drillEditorService.getMemberSelection());
    };

    $scope.save = function() {
      save();
      deactivate();
    };

    $scope.cancel = deactivate;

    function activate(memberSelection, turnDirection) {
      if (ctrl.isActivated) {
        deactivate();
      }

      appStateService.setActiveTool('columnTool', () => {
        deactivate(false);
      });

      ctrl.isActivated = true;
      ctrl.memberSelection = memberSelection;
      ctrl.block = new Block(ctrl.memberSelection.members);
      ctrl.subscriptions.subscribe(Events.membersSelected, (evt, args) => {
        if (!ctrl.isActivated) return;
        ctrl.memberSelection = drillEditorService.getMemberSelection();
        ctrl.block = new Block(ctrl.memberSelection.members);
        eventService.notify(Events.drillStateChanged);
        activate(ctrl.memberSelection);
      });
      if (turnDirection == null) {
        ctrl.turnDirection = getDefaultDirection();
      }
      ctrl.fileDelay = 2;
      ctrl.reverse = getReverseValue();
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

    function getDefaultDirection() {
      const leftLeaderPos = new MemberPosition(
        ctrl.block.leftFileLeader.member
      );
      return leftLeaderPos.isBehind(ctrl.block.rightFileLeader.member)
        ? 'left'
        : 'right';
    }

    function getReverseValue() {
      return !ctrl.block.areFileLeadersStraight();
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
        reverse: ctrl.reverse,
      };
    }
  },
});
