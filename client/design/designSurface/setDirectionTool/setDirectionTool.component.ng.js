'use strict';

import Events from '/client/lib/Events';
import Direction from '../../../lib/Direction';

angular.module('drillApp').component('setDirectionTool', {
  templateUrl:
    'client/design/designSurface/setDirectionTool/setDirectionTool.view.ng.html',
  bindings: {},
  controller: function(
    $scope,
    $controller,
    drillEditorService,
    eventService
  ) {
    let ctrl = this;

    angular.extend(ctrl, $controller('toolBaseController', { $scope: $scope }));

    ctrl.$onInit = function() {
      ctrl.registerActivateEvent(Events.activateSetDirectionTool);
      ctrl.registerDeactivateEvent(Events.setDirectionToolDeactivated);

      ctrl.onSelectionChanged(onSelectionChanged);
      ctrl.onActivated(onActivated);
      ctrl.onDeactivated(onDeactivated);
      ctrl.onSave(onSave);
      ctrl.onCancel(onCancel);

      ctrl.direction = Direction.N;
      ctrl.setDirection = setDirection;

      $scope.$watch('$ctrl.fileDelay', onOptionChanged);
      $scope.$watch('$ctrl.fileDelayDirection', onOptionChanged);
      $scope.$watch('$ctrl.rankDelay', onOptionChanged);
      $scope.$watch('$ctrl.rankDelayDirection', onOptionChanged);
    };

    function onSelectionChanged(args) {
      // previewFootprints();
    }

    function onActivated() {
      ctrl.setActiveTool('setDirectionTool');
      // previewFootprints();
    }

    function onDeactivated() {}

    function onSave() {
      // drillEditorService.toTheRears(getToTheRearOptions());
      drillEditorService.setDirectionOverride(ctrl.direction);
      drillEditorService.goToCount(drillEditorService.drill.count);
      eventService.notify(Events.updateField);
    }

    function onCancel() {}

    function onOptionChanged(newVal, oldVal) {
      // previewFootprints();
    }

    function setDirection(direction) {
      ctrl.direction = Direction.getDirection(direction);
      console.log(direction);
    }

    // function previewFootprints() {
    //   if (!ctrl.isActivated() || !ctrl.hasSelection()) {
    //     return;
    //   }
    //   const members = ctrl.currentSelection().members;
    //   const memberSequences = new ToTheRears(members).generate(
    //     getToTheRearOptions()
    //   );
    //   drillEditorService.clearFootprints();
    //   drillEditorService.previewFootprints(members, memberSequences, 24);
    // }

    // function getToTheRearOptions() {
    //   return {
    //     fileDelay: ctrl.fileDelay,
    //     fileDelayDirection: ctrl.fileDelayDirection,
    //     rankDelay: ctrl.rankDelay,
    //     rankDelayDirection: ctrl.rankDelayDirection,
    //   };
    // }
  },
});
