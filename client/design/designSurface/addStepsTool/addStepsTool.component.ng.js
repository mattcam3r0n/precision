'use strict';

import { FieldPoint, StepPoint } from '/client/lib/Point';
import StrideType from '/client/lib/StrideType';
import StepType from '/client/lib/StepType';
import FieldDimensions from '/client/lib/FieldDimensions';
import Direction from '/client/lib/Direction';

angular.module('drillApp')
  .component('addStepsTool', {
    templateUrl: 'client/design/designSurface/addStepsTool/addStepsTool.view.ng.html',
    bindings: {
    },
    controller: function ($scope, drillEditorService, eventService) {
      var ctrl = this;

      ctrl.$onInit = function () {        
        ctrl.isActivated = true;
        ctrl.unsubscribeAddStepsToolActivated = eventService.subscribeAddStepsToolActivated((evt, args) => {
          activate(drillEditorService.getMemberSelection());
        });

        ctrl.toolDiv = angular.element('.add-steps-tool')[0];

        $scope.strideType = drillEditorService.strideType;
      }

      ctrl.$onDestroy = function () {
        ctrl.unsubscribeAddStepsToolActivated();
      }

      $scope.activate = activate;

      $scope.cancel = deactivate;

      $scope.deactivate = function () {
      }

      $scope.reset = function() {
        reset();
      }

      $scope.getStrideType = function() {
        return drillEditorService.strideType;
      }

      $scope.addStep = function(dir) {
        drillEditorService.addStep(Direction[dir]);
      }

      $scope.addCountermarch = function() {
        drillEditorService.addCountermarch();
      }

      $scope.addMarkTime = function() {
        drillEditorService.addStep(null, StepType.MarkTime);        
      }

      $scope.addHalt = function() {
        // using null direction so it will default to current dir
        drillEditorService.addStep(null, StepType.Halt);                
      }

      $scope.backspaceDelete = function() {
        drillEditorService.deleteBackspace();
      }

      function activate(memberSelection) {
        if (ctrl.isActivated)
          deactivate();

        ctrl.isActivated = true;
        ctrl.memberSelection = memberSelection;
      }

      function deactivate() {
        ctrl.isActivated = false;
        // TODO: use events to signal this, if still needed?
        // ctrl.field.enablePositionIndicator();
        // ctrl.field.canvas.selection = true;
        // ctrl.field.canvas.defaultCursor = 'default';
      }


    }
  });


