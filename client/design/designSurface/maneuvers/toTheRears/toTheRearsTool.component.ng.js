'use strict';

import Events from '/client/lib/Events';
import ToTheRears from '/client/lib/drill/maneuvers/ToTheRears';

angular.module('drillApp').component('toTheRearsTool', {
  templateUrl:
    'client/design/designSurface/maneuvers/toTheRears/toTheRearsTool.view.ng.html',
  bindings: {},
  controller: function(
    $scope,
    $controller,
    drillEditorService
  ) {
    let ctrl = this;

    angular.extend(ctrl, $controller('toolBaseController', { $scope: $scope }));

    ctrl.$onInit = function() {
      ctrl.registerActivateEvent(Events.activateToTheRearsTool);
      ctrl.registerDeactivateEvent(Events.toTheRearsToolDeactivated);

      ctrl.onSelectionChanged(onSelectionChanged);
      ctrl.onActivated(onActivated);
      ctrl.onDeactivated(onDeactivated);
      ctrl.onSave(onSave);
      ctrl.onCancel(onCancel);

      ctrl.fileDelay = 2;
      ctrl.rankDelay = 0;
      ctrl.fileDelayDirection = 'left-to-right';
      ctrl.rankDelayDirection = 'back-to-front';

      $scope.$watch('$ctrl.fileDelay', onOptionChanged);
      $scope.$watch('$ctrl.fileDelayDirection', onOptionChanged);
      $scope.$watch('$ctrl.rankDelay', onOptionChanged);
      $scope.$watch('$ctrl.rankDelayDirection', onOptionChanged);
    };

    function onSelectionChanged(args) {
      previewFootprints();
    }

    function onActivated() {
      ctrl.setActiveTool('toTheRearsTool');
      previewFootprints();
    }

    function onDeactivated() {}

    function onSave() {
      drillEditorService.toTheRears(getToTheRearOptions());
    }

    function onCancel() {}

    function onOptionChanged(newVal, oldVal) {
      previewFootprints();
    }

    function previewFootprints() {
      if (!ctrl.isActivated() || !ctrl.hasSelection()) {
        return;
      }
      const members = ctrl.currentSelection().members;
      const memberSequences = new ToTheRears(members).generate(
        getToTheRearOptions()
      );
      drillEditorService.clearFootprints();
      drillEditorService.previewFootprints(members, memberSequences, 24);
    }

    function getToTheRearOptions() {
      return {
        fileDelay: ctrl.fileDelay,
        fileDelayDirection: ctrl.fileDelayDirection,
        rankDelay: ctrl.rankDelay,
        rankDelayDirection: ctrl.rankDelayDirection,
      };
    }
  },
});
