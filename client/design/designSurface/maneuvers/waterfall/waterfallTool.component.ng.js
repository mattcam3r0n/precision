'use strict';

import Events from '/client/lib/Events';
import Waterfall from '../../../../lib/drill/maneuvers/Waterfall';
import Block from '../../../../lib/drill/Block';
import MemberPosition from '../../../../lib/drill/MemberPosition';

angular.module('drillApp').component('waterfallTool', {
  // eslint-disable-next-line max-len
  templateUrl:
    'client/design/designSurface/maneuvers/waterfall/waterfallTool.view.ng.html',
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
        Events.activateWaterfallTool,
        (evt, args) => {
          activate(drillEditorService.getMemberSelection());
        }
      );

      ctrl.turnDirection = 'right';
      ctrl.fileDelay = 6;
      ctrl.depth = 6;
      ctrl.repeat = 1;
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

    ctrl.setRepeat = function(repeat) {
      if (repeat != null) {
        ctrl.repeat = repeat;
      }
      activate(drillEditorService.getMemberSelection());
    };

    ctrl.setDepth = function(depth) {
      if (depth != null) {
        ctrl.depth = depth;
      }
      activate(drillEditorService.getMemberSelection());
    };

    // ctrl.setReverseFlag = function() {
    //   activate(drillEditorService.getMemberSelection());
    // };

    $scope.save = function() {
      save();
      deactivate();
    };

    $scope.cancel = deactivate;

    function activate(memberSelection, turnDirection) {
      if (ctrl.isActivated) {
        deactivate();
      }

      appStateService.setActiveTool('waterfallTool', () => {
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
      if (turnDirection == null) {
        ctrl.turnDirection = getDefaultDirection();
      }
      // ctrl.fileDelay = 2;
      ctrl.reverse = getReverseValue();
      previewFootprints();
    }

    function previewFootprints() {
      alertIfNoSelection();
      const members = ctrl.memberSelection.members;
      const memberSequences = new Waterfall(members).generate(getOptions());
      drillEditorService.previewFootprints(members, memberSequences, 24);
    }

    function alertIfNoSelection() {
      if (!ctrl.memberSelection || ctrl.memberSelection.length == 0) {
        alertService.info('You must select a block to work with.');
        return;
      }
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
        eventService.notify(Events.waterfallToolDeactivated);
      }
    }

    function save() {
      drillEditorService.waterfall(getOptions());

      deactivate();
    }

    function getOptions() {
      return {
        turnDirection: ctrl.turnDirection || 'right',
        fileDelay: ctrl.fileDelay || 2,
        depth: ctrl.depth,
        reverse: ctrl.reverse,
        repeat: ctrl.repeat,
      };
    }
  },
});
