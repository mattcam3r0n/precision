'use strict';

import { FieldPoint, StepPoint } from '/client/lib/Point';
import StrideType from '/client/lib/StrideType';
import FieldDimensions from '/client/lib/FieldDimensions';
import Direction from '/client/lib/Direction';

angular.module('drillApp')
  .component('addStepsTool', {
    templateUrl: 'client/design/designSurface/addStepsTool/addStepsTool.view.ng.html',
    bindings: {
      field: '<'
    },
    controller: function ($scope, $window) {
      var ctrl = this;
      var toolDiv = angular.element('.add-steps-tool')[0];

      // bootstrap follow toggle button
      $("[name='stride-type-switch']").bootstrapSwitch();

      $scope.$on('design:activateAddStepsTool', function (evt, args) {
        activate(args.memberSelection);
      });

      $scope.$on('design:membersSelected', function(evt, args) {
        if (!ctrl.isActivated) return;
      });

      // TODO: need a way to detect selection changes, reset?

      ctrl.$onInit = function () {
      }

      ctrl.$onDestroy = function () {
      }

      $scope.activate = activate;

      $scope.cancel = deactivate;

      $scope.deactivate = function () {
      }

      $scope.reset = function() {
        reset();
      }

      $scope.addStep = function(dir) {

      }

      $scope.addMarkTime = function() {

      }

      $scope.addHalt = function() {

      }

      $scope.backspaceDelete = function() {
        
      }

      function activate(memberSelection) {
        if (ctrl.isActivated)
          deactivate();

        ctrl.isActivated = true;
        ctrl.memberSelection = memberSelection;

//        createPathTool();
//        initGuidePaths();
        positionTools();
      }

      function deactivate() {
        if (ctrl.deregisterOnBackspacePressed)
          ctrl.deregisterOnBackspacePressed();
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

        toolDiv.style.left = left + 'px';
        toolDiv.style.top = top + 'px';
      }

    }
  });


