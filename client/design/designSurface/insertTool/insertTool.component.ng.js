'use strict';

import Events from '/client/lib/Events';

angular.module('drillApp').component('insertTool', {
  templateUrl: 'client/design/designSurface/insertTool/insertTool.view.ng.html',
  bindings: {},
  controller: function($scope, $controller, drillEditorService, utilService) {
    let ctrl = this;

    angular.extend(ctrl, $controller('toolBaseController', { $scope: $scope }));

    ctrl.$onInit = function() {
      ctrl.registerActivateEvent(Events.activateInsertTool);
      ctrl.registerDeactivateEvent(Events.insertToolDeactivated);

      ctrl.onSelectionChanged(onSelectionChanged);
      ctrl.onActivated(onActivated);
      ctrl.onDeactivated(onDeactivated);
      ctrl.onSave(onSave);
      ctrl.onCancel(onCancel);

      $scope.$watch('$ctrl.initialState', onOptionChanged);
      $scope.$watch('$ctrl.counts', onOptionChanged);
    };

    ctrl.setInitialState = (state) => {
      ctrl.initialState = state;
      utilService.blurActiveElement();
    };

    function onSelectionChanged(args) {
      previewFootprints();
    }

    function onActivated() {
      ctrl.setActiveTool('stepTwoTool');
      ctrl.initialState = ctrl.initialState || 'halt';
      ctrl.counts = ctrl.counts || 8;
    }

    function onDeactivated() {}

    function onSave() {
      if (ctrl.initialState == 'halt') {
        drillEditorService.insertHalt(ctrl.counts);
      } else {
        drillEditorService.insertMarkTime(ctrl.counts);
      }
    }

    function onCancel() {}

    function onOptionChanged(newVal, oldVal) {}
  },
});
