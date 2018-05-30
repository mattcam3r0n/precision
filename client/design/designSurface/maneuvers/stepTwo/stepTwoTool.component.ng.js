'use strict';

import Events from '/client/lib/Events';
import StepTwo from '/client/lib/drill/maneuvers/StepTwo';

angular.module('drillApp').component('stepTwoTool', {
  templateUrl:
    'client/design/designSurface/maneuvers/stepTwo/stepTwoTool.view.ng.html',
  bindings: {},
  controller: function(
    $scope,
    $controller,
    drillEditorService,
    utilService
  ) {
    let ctrl = this;

    angular.extend(ctrl, $controller('toolBaseController', { $scope: $scope }));

    ctrl.$onInit = function() {
      ctrl.registerActivateEvent(Events.activateStepTwoTool);
      ctrl.registerDeactivateEvent(Events.stepTwoToolDeactivated);

      ctrl.onSelectionChanged(onSelectionChanged);
      ctrl.onActivated(onActivated);
      ctrl.onDeactivated(onDeactivated);
      ctrl.onSave(onSave);
      ctrl.onCancel(onCancel);

      $scope.$watch('$ctrl.initialState', onOptionChanged);
      $scope.$watch('$ctrl.fileDelay', onOptionChanged);
      $scope.$watch('$ctrl.fileDelayDirection', onOptionChanged);
      $scope.$watch('$ctrl.rankDelay', onOptionChanged);
      $scope.$watch('$ctrl.rankDelayDirection', onOptionChanged);
    };

    ctrl.setInitialState = (state) => {
      ctrl.initialState = state;
      console.log('setInitialState', state, ctrl.initialState);
      utilService.blurActiveElement();
    };

    function onSelectionChanged(args) {
      previewFootprints();
    }

    function onActivated() {
      ctrl.setActiveTool('stepTwoTool');
      ctrl.initialState = 'halt';
      ctrl.fileDelay = 2;
      ctrl.fileDelayDirection = 'left-to-right';
      ctrl.rankDelay = 0;
      ctrl.rankDelayDirection = 'front-to-back';
      previewFootprints();
    }

    function onDeactivated() {}

    function onSave() {
      drillEditorService.stepTwo(getOptions());
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
      const memberSequences = new StepTwo(members).generate(
        getOptions()
      );
      drillEditorService.clearFootprints();
      drillEditorService.previewFootprints(members, memberSequences, 24);
    }

    function getOptions() {
      return {
        initialState: ctrl.initialState,
        fileDelay: ctrl.fileDelay,
        fileDelayDirection: ctrl.fileDelayDirection,
        rankDelay: ctrl.rankDelay,
        rankDelayDirection: ctrl.rankDelayDirection,
      };
    }
  },
});
