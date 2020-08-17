'use strict';

import Events from '/client/lib/Events';
import Countermarch from '../../../../lib/drill/maneuvers/Countermarch';
import StepType from '/client/lib/StepType';

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
    alertService,
    eventService,
    utilService
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
      ctrl.stepType = StepType.Half;
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
      utilService.blurActiveElement();
      activate(drillEditorService.getMemberSelection());
    };

    ctrl.setFileDelay = function(counts) {
      ctrl.fileDelay = counts;
      activate(drillEditorService.getMemberSelection());
    };

    ctrl.setFileDelayDirection = function(dir) {
      ctrl.fileDelayDirection = dir;
      utilService.blurActiveElement();
      activate(drillEditorService.getMemberSelection());
    };

    ctrl.setRankDelay = function(counts) {
      ctrl.rankDelay = counts;
      activate(drillEditorService.getMemberSelection());
    };

    ctrl.setStepType = function(type) {
      ctrl.stepType = type;
      utilService.blurActiveElement();
      activate(drillEditorService.getMemberSelection());
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
        stepType: ctrl.stepType,
      };
    }

    function save() {
      drillEditorService.countermarch({
        countermarchDirection: ctrl.countermarchDirection,
        fileDelay: ctrl.fileDelay,
        fileDelayDirection: ctrl.fileDelayDirection,
        rankDelay: ctrl.rankDelay,
        stepType: ctrl.stepType,
      });

      deactivate();
    }
  },
});
