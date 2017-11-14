'use strict';

import { FieldPoint, StepPoint } from '/client/lib/Point';
import StrideType from '/client/lib/StrideType';
import FieldDimensions from '/client/lib/FieldDimensions';
import Direction from '/client/lib/Direction';
import PathTool from './PathTool';

angular.module('drillApp')
  .component('drawPathsTool', {
    templateUrl: 'client/design/designSurface/drawPathsTool/drawPathsTool.view.ng.html',
    bindings: {
      field: '<'
    },
    controller: function ($scope, $window, drillEditorService, eventService) {
      var ctrl = this;
      var toolDiv = angular.element('.draw-paths-tool')[0];
      var newTurns = [];

      // bootstrap follow toggle button
      $("[name='stride-type-switch']").bootstrapSwitch();

      var unsubscribeDrawPathsToolActivated = eventService.subscribeDrawPathsToolActivated(() => {
        activate(drillEditorService.getMemberSelection());
      });

      var unsubscribeMembersSelected = drillEditorService.subscribeMembersSelected((evt, args) => {
        if (!ctrl.isActivated) return;
        // activate(drillEditorService.getMemberSelection());
        ctrl.memberSelection = args.memberSelection;
        createPathTool();
      });

      // TODO: need a way to detect selection changes, reset?

      ctrl.$onInit = function () {
        ctrl.turnMode = 'block';
      }

      ctrl.$onDestroy = function () {
        unsubscribeDrawPathsToolActivated();
        unsubscribeMembersSelected();
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

      $scope.isCurrentDirection= function(dir) {
        return ctrl.turnDirection == Direction[dir];
      }

      $scope.setTurnDirection = function(dir) {
        ctrl.turnDirection = Direction[dir];
        ctrl.field.canvas.defaultCursor = "url(/icons/" + dir + ".svg) 16 16, auto";
        ctrl.activePathTool.setCurrentTurnDirection(Direction[dir]);
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
        //if (ctrl.memberSelection.members.length == 0) return;

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

        drillEditorService.save(true);          
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


