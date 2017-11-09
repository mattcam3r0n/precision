'use strict';

import { FieldPoint, StepPoint } from '/client/lib/Point';
import StrideType from '/client/lib/StrideType';
import FieldDimensions from '/client/lib/FieldDimensions';
import Direction from '/client/lib/Direction';
import PathTool from './PathTool';

angular.module('drillApp')
  .component('addTurnsTool', {
    templateUrl: 'client/design/designSurface/addTurnsTool/addTurnsTool.view.ng.html',
    bindings: {
      field: '<'
    },
    controller: function ($scope, $window) {
      var ctrl = this;
      var toolDiv = angular.element('.add-turns-tool')[0];
      var newTurns = [];

      // bootstrap follow toggle button
      $("[name='follow-switch']").bootstrapSwitch();

      $scope.$on('design:activateAddTurnsTool', function (evt, args) {
        activate(args.memberSelection);
      });

      $scope.$on('design:membersSelected', function(evt, args) {
        if (!ctrl.isActivated) return;

        ctrl.memberSelection = args.memberSelection;
        createPathTool();
      });

      // TODO: need a way to detect selection changes, reset?

      ctrl.$onInit = function () {
        ctrl.turnMode = 'block';
      }

      ctrl.$onDestroy = function () {
      }

      $scope.activate = activate;

      $scope.deactivate = function () {
      }

      $scope.save = function () {
        save();
        deactivate();
      }

      $scope.cancel = deactivate;

      $scope.reset = function() {
        reset();
      }

      $scope.setTurnDirection = function(dir) {
        ctrl.turnDirection = Direction[dir];
      }

      $scope.isBlockMode = function() {
        return ctrl.turnMode == 'block';
      }

      $scope.isFileMode = function() {
        return ctrl.turnMode == 'file';        
      }

      $scope.setTurnMode = function(mode) {
        ctrl.turnMode = mode;
        createPathTool();
      }

      function activate(memberSelection) {
        if (ctrl.isActivated)
          deactivate();

        ctrl.isActivated = true;
        ctrl.memberSelection = memberSelection;

        createPathTool();
//        initGuidePaths();
        positionTools();

        ctrl.field.canvas.defaultCursor = 'crosshair';
        ctrl.field.canvas.on('mouse:up', onMouseUp);
        ctrl.deregisterOnBackspacePressed = $scope.$on('design:backspacePressed', onBackspacePressed);
      }

      function deactivate() {
        if (ctrl.deregisterOnBackspacePressed)
          ctrl.deregisterOnBackspacePressed();
        ctrl.isActivated = false;
        ctrl.field.enablePositionIndicator();
        ctrl.field.canvas.selection = true;
        ctrl.field.canvas.off('mouse:up', onMouseUp);
        ctrl.field.canvas.defaultCursor = 'default';
        destroyGuidePaths();
        destroyPathTool();
      }

      function reset() {
        deactivate();
        activate(ctrl.memberSelection);
      }
      
      function createPathTool() {
        if (ctrl.memberSelection.members.length == 0) return;

        if (ctrl.activePathTool) 
          destroyPathTool();

        ctrl.activePathTool = new PathTool(ctrl.field, ctrl.memberSelection, ctrl.turnMode);
      }

      function destroyPathTool(){
        if (!ctrl.activePathTool) return;

        ctrl.activePathTool.dispose();
      }

      function onBackspacePressed(evt) {
        // how to get corresponding turn?
        if (!ctrl.field.canvas.getActiveObject()) return;

        var target = ctrl.field.canvas.getActiveObject();

        //removeTurnMarker(target);
        ctrl.guidePaths.forEach(gp => gp.removeTurnMarker(target));
      }

      function onMouseUp(evt) {
        if (!evt.isClick) return;
        if (evt.target !== null) return; // clicked on an object

        // have to adjust point for zoom
        var adjustedPoint = ctrl.field.adjustMousePoint({ x: evt.e.layerX, y: evt.e.layerY });
        var stepPoint = new FieldPoint(adjustedPoint).toStepPoint(StrideType.SixToFive);

        // add turn at step point
        ctrl.activePathTool.addTurnMarker(ctrl.turnDirection, stepPoint);
      }

      function destroyGuidePaths() {
        if (!ctrl.guidePaths) return;

        ctrl.guidePaths.forEach(gp => gp.dispose());
      }

      function save() {
        if (!ctrl.activePathTool) return;

        ctrl.activePathTool.save();

        $scope.$emit('addTurnsTool:save');
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


