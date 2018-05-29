'use strict';

import Events from '/client/lib/Events';
import ToTheRears from '/client/lib/drill/maneuvers/ToTheRears';

angular.module('drillApp').component('toTheRearsTool', {
  templateUrl:
    'client/design/designSurface/maneuvers/toTheRears/toTheRearsTool.view.ng.html',
  bindings: {},
  controller: function(
    $scope,
    $rootScope,
    $window,
    appStateService,
    drillEditorService,
    alertService,
    eventService
  ) {
    let ctrl = this;

    ctrl.$onInit = function() {
      $('[data-toggle="tooltip"]').tooltip();

      ctrl.isActivated = false;
      ctrl.subscriptions = eventService.createSubscriptionManager();

      ctrl.subscriptions.subscribe(
        Events.activateToTheRearsTool,
        (evt, args) => {
          activate(drillEditorService.getMemberSelection());
        }
      );
    };

    ctrl.$onChanges = function() {
      console.log('$onChanges');
    };

    ctrl.$onDestroy = function() {
      ctrl.subscriptions.unsubscribeAll();
    };

    ctrl.log = function() {
      // $rootScope.$safeApply();
      console.log(getToTheRearOptions());
    };

    ctrl.save = function() {
      save();
      deactivate();
    };

    ctrl.cancel = function() {
      cancel();
      deactivate();
    };

    $scope.$watch('$ctrl.fileDelay', (newVal, oldVal) => {
      previewFootprints();
    });

    $scope.$watch('$ctrl.fileDelayDirection', (newVal, oldVal) => {
      previewFootprints();
    });

    $scope.$watch('$ctrl.rankDelay', (newVal, oldVal) => {
      previewFootprints();
    });

    $scope.$watch('$ctrl.rankDelayDirection', (newVal, oldVal) => {
      previewFootprints();
    });

    function activate(memberSelection) {
      if (ctrl.isActivated) {
        deactivate();
      }

      appStateService.setActiveTool('toTheRearsTool', () => {
        deactivate(false);
      });

      ctrl.isActivated = true;
      ctrl.fileDelay = 2;
      ctrl.fileDelayDirection = 'left-to-right';
      ctrl.rankDelay = 0;
      ctrl.rankDelayDirection = 'back-to-front';
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
      // $rootScope.$safeApply();
      if (!ctrl.memberSelection || ctrl.memberSelection.length == 0) {
        alertService.info('You must select a block to work with.');
        return;
      }
      const members = ctrl.memberSelection.members;
      const memberSequences = new ToTheRears(members).generate(
        getToTheRearOptions()
      );
      drillEditorService.clearFootprints();
      drillEditorService.previewFootprints(members, memberSequences, 24);
    }

    function deactivate(notify = true) {
      ctrl.subscriptions.unsubscribe(Events.membersSelected);

      ctrl.isActivated = false;
      eventService.notify(Events.clearFootprints);
      eventService.notify(Events.updateField);
      if (notify) {
        eventService.notify(Events.toTheRearsToolDeactivated);
      }
    }

    function getToTheRearOptions() {
      return {
        fileDelay: ctrl.fileDelay,
        fileDelayDirection: ctrl.fileDelayDirection,
        rankDelay: ctrl.rankDelay,
        rankDelayDirection: ctrl.rankDelayDirection,
      };
    }

    function save() {
      drillEditorService.toTheRears(getToTheRearOptions());
    }

    function cancel() {}
  },
});
