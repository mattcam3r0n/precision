'use strict';

import { FieldPoint, StepPoint } from '/client/lib/Point';
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

      var unsubscribeDrawPathsToolActivated = eventService.subscribeDrawPathsToolActivated(() => {
        activate(drillEditorService.getMemberSelection());
      });

      var unsubscribeStrideTypeChanged = drillEditorService.subscribeStrideTypeChanged((evt, args) => {
        if (!ctrl.isActivated) return;
        activate(drillEditorService.getMemberSelection());        
      });

      ctrl.$onInit = function () {
        ctrl.turnMode = 'block';
        ctrl.toolDiv = angular.element('.draw-paths-tool')[0];
      }

      ctrl.$onDestroy = function () {
        unsubscribeDrawPathsToolActivated();
        unsubscribeStrideTypeChanged();
      }

      // $scope.activate = activate;

      // $scope.deactivate = function () {
      // }

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

      $scope.setTurnDirection = setTurnDirection;

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
        ctrl.strideType = drillEditorService.strideType;

        createPathTool();

        ctrl.field.disablePositionIndicator();
        setTurnDirection(Direction.E);
        ctrl.field.canvas.on('mouse:up', onMouseUp);
        ctrl.unsubscribeDeleteTurn = eventService.subscribeDeleteTurn(onBackspacePressed);
        ctrl.unsubscribeMembersSelected = drillEditorService.subscribeMembersSelected((evt, args) => {
          if (!ctrl.isActivated) return;
          ctrl.memberSelection = args.memberSelection;
          createPathTool();
        });
  
      }

      function deactivate() {
        if (ctrl.unsubscribeDeleteTurn) 
          ctrl.unsubscribeDeleteTurn();
        if (ctrl.unsubscribeMembersSelected)
          ctrl.unsubscribeMembersSelected();
        ctrl.isActivated = false;
        ctrl.field.enablePositionIndicator();
        ctrl.field.canvas.selection = true;
        ctrl.field.canvas.off('mouse:up', onMouseUp);
        ctrl.field.canvas.defaultCursor = 'default';
        destroyPathTool();
        eventService.notifyUpdateField();
        ctrl.field.update();
      }

      function setTurnDirection(direction) {
        dir = Direction.getDirection(direction);
        ctrl.turnDirection = dir;
        ctrl.field.canvas.defaultCursor = "url(/icons/" + Direction.getDirectionName(dir) + ".svg) 8 8, auto";
        ctrl.activePathTool.setCurrentTurnDirection(Direction[dir]);
      }      

      function reset() {
        deactivate();
        activate(ctrl.memberSelection);
      }
      
      function createPathTool() {
        //if (ctrl.memberSelection.members.length == 0) return;

        if (ctrl.activePathTool) 
          destroyPathTool();

        ctrl.activePathTool = new PathTool(ctrl.field, ctrl.memberSelection, ctrl.turnMode, ctrl.strideType);
        eventService.notifyUpdateField();
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
        ctrl.activePathTool.removeTurnMarker(target);
//        ctrl.guidePaths.forEach(gp => gp.removeTurnMarker(target));
      }

      function onMouseUp(evt) {
        if (!evt.isClick) return;
        if (evt.target !== null) return; // clicked on an object

        // have to adjust point for zoom
        var adjustedPoint = ctrl.field.adjustMousePoint({ x: evt.e.layerX, y: evt.e.layerY });
        var stepPoint = new FieldPoint(adjustedPoint); //.toStepPoint(ctrl.strideType);

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

    }
  });


