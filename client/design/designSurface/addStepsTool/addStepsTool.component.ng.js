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
      field: '<'
    },
    controller: function ($scope, drillEditorService, eventService) {
      var ctrl = this;

      ctrl.$onInit = function () {
        // bootstrap follow toggle button
        $("[name='stride-type-switch']").bootstrapSwitch('state', drillEditorService.strideType);
        $("input[name='stride-type-switch']").on('switchChange.bootstrapSwitch', function(event, state) {
          if (state) {
            drillEditorService.strideType = StrideType.EightToFive;
          } else {
            drillEditorService.strideType = StrideType.SixToFive;
          }
          console.log(drillEditorService.strideType);
        });
        
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
    console.log(drillEditorService.strideType);
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

        positionTools();
      }

      function deactivate() {
        ctrl.isActivated = false;
        ctrl.field.enablePositionIndicator();
        ctrl.field.canvas.selection = true;
        ctrl.field.canvas.defaultCursor = 'default';
      }

      function positionTools(obj) {
        // TODO
        // * make this better
        // * take selected members in to account?
        // * handle error when no members

        // get leftmost marcher
        var leftmost = ctrl.field.getLeftmostMarcherPosition();

        var absCoords = ctrl.field.getAbsoluteCoords(leftmost);
        var left = absCoords.left - 200;
        if (left < 0) {
          left = absCoords.left + absCoords.width + 20;
        }
        var top = absCoords.top - 100;

        ctrl.toolDiv.style.left = left + 'px';
        ctrl.toolDiv.style.top = top + 'px';
      }

    }
  });


