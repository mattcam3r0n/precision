'use strict';

import { FieldPoint, StepPoint } from '/client/lib/Point';
import StrideType from '/client/lib/StrideType';
import StepType from '/client/lib/StepType';
import StepDelta from '/client/lib/StepDelta';
import FieldDimensions from '/client/lib/FieldDimensions';
import Direction from '/client/lib/Direction';
import TurnMarker from '../field/TurnMarker';
import CounterMarch from '../field/CounterMarch';
import GuidePath from './GuidePath';
import ScriptBuilder from '/client/lib/drill/ScriptBuilder';
import Action from '/client/lib/drill/Action';

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

      // TODO: need a way to detect selection changes, reset?

      ctrl.$onInit = function () {
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

      $scope.setTurnDirection = function (dir) {
        ctrl.turnDirection = Direction[dir];
      }

      function activate(memberSelection) {
        if (ctrl.isActivated)
          deactivate();

        ctrl.isActivated = true;
        ctrl.memberSelection = memberSelection;

        initGuidePaths();
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
      }

      function reset() {
        console.log('reset');
        deactivate();
        activate(ctrl.memberSelection);
      }
      
      function initGuidePaths() {
        ctrl.guidePaths = [];
        var files = ctrl.memberSelection.getFiles();

        files.forEach(f => {
          let gp = new GuidePath(ctrl.field, f, {
            strideType: f.leader.member.currentState.strideType,
            stepType: f.leader.member.currentState.stepType,
            direction: f.leader.member.currentState.direction,
            x: f.leader.member.currentState.x,
            y: f.leader.member.currentState.y
          });
          ctrl.guidePaths.push(gp);
        });

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
        addTurnMarker(stepPoint);
      }

      function findGuidePath(stepPoint) {
        return ctrl.guidePaths.find(p => p.isInPath(stepPoint));
      }

      function addTurnMarker(stepPoint) {
        var guidePath = findGuidePath(stepPoint);

        // don't allow turn to be added if not on a guidepath
        if (!guidePath) return;

        var turnDirection = ctrl.turnDirection == undefined ? guidePath.lastPoint.direction : ctrl.turnDirection;

        // if (turnDirection == Direction.CM) {
        //   return addCounterMarchMarker(guidePath, stepPoint);
        // }

        // add turn to guidepath
        guidePath.add({
          x: stepPoint.x,
          y: stepPoint.y,
          direction: turnDirection,
          strideType: StrideType.SixToFive,
          stepType: StepType.Full
        });   
      }

      function addCounterMarchMarker(guidePath, stepPoint) {
        //guidePath.addCountermarch();
        
        
        // var isLeftTurn = guidePath.getEndCount(stepPoint) % 2 == 0 ? true : false;

        // var currentDir = guidePath.lastPoint.direction;
        // var firstTurnDirection = isLeftTurn ? Direction.leftTurnDirection(currentDir) : Direction.rightTurnDirection(currentDir); 
        // var secondTurnDirection = isLeftTurn ? Direction.leftTurnDirection(firstTurnDirection) : Direction.rightTurnDirection(firstTurnDirection); 
        // var firstDelta = StepDelta.getDelta(StrideType.SixToFive, StepType.Half, firstTurnDirection, 2);
        
        // guidePath.add({
        //   x: stepPoint.x,
        //   y: stepPoint.y,
        //   direction: firstTurnDirection,
        //   strideType: StrideType.SixToFive,
        //   stepType: StepType.Half
        // }); 

        // var secondDelta = StepDelta.getDelta(StrideType.SixToFive, StepType.Full, secondTurnDirection, 1);

        // guidePath.add({
        //   x: stepPoint.x + firstDelta.deltaX,
        //   y: stepPoint.y + firstDelta.deltaY,
        //   direction: secondTurnDirection,
        //   strideType: StrideType.SixToFive,
        //   stepType: StepType.Full
        // }); 

        // var fp = stepPoint.toFieldPoint();

        // var tm = new CounterMarch(currentDir, isLeftTurn, {
        //     left: fp.x,
        //     top: fp.y
        //   });

        // ctrl.field.canvas.add(tm);

        // var t = {
        //   turnMarker: tm,
        //   point: stepPoint
        // };
        // tm.turn = t;

        // tm.on('moving', evt => {
        //   let adjustedPoint = ctrl.field.adjustMousePoint({ x: evt.e.layerX, y: evt.e.layerY });
        //   let newStepPoint = new FieldPoint(adjustedPoint).toStepPoint(StrideType.SixToFive);
        //   // update turn point
        //   tm.turn.point = newStepPoint;
        // });

        // newTurns.push(t);
        // createGuidePathLines();

        // return t;
      }

      function destroyGuidePaths() {
        if (!ctrl.guidePaths) return;

        ctrl.guidePaths.forEach(gp => gp.dispose());
      }

      function save() {
        if (!ctrl.guidePaths) return;

        ctrl.guidePaths.forEach(gp => {
          if (gp.points.length > 1) {
            // for each file member
            gp.file.fileMembers.forEach(fm => {
              // get current count + offset from leader (in counts)
              let count = fm.member.currentState.count + fm.getStepsToLeader();
              // for each point in guide path
              gp.points.slice(1).forEach(p => { // skip first point, since it is current position
                let action = new Action(p);
                let added = ScriptBuilder.addActionAtPoint(fm.member, action, p);
              });
            });
          }
        });
      
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


