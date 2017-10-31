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
        console.log('design:activateAddTurnsTool', evt, args);
        activate(args.memberSelection);
      });

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
        console.log('addTurnsTool activate');
        if (ctrl.isActivated)
          deactivate();

        ctrl.isActivated = true;
        ctrl.memberSelection = memberSelection;

        initGuidePaths();
        positionTools();

        ctrl.field.canvas.defaultCursor = 'crosshair';
        ctrl.field.canvas.on('mouse:up', onMouseUp);
        ctrl.field.canvas.on('mouse:move', onMouseMove);
        ctrl.deregisterOnBackspacePressed = $scope.$on('design:backspacePressed', onBackspacePressed);
      }

      function deactivate() {
        console.log('addTurnsTool deactivate');
        if (ctrl.deregisterOnBackspacePressed)
          ctrl.deregisterOnBackspacePressed();
        ctrl.isActivated = false;
        ctrl.field.enablePositionIndicator();
        ctrl.field.canvas.selection = true;
        ctrl.field.canvas.off('mouse:up', onMouseUp);
        ctrl.field.canvas.off('mouse:move', onMouseMove);
        ctrl.field.canvas.defaultCursor = 'default';
        destroyGuideline();
        destroyGuidePathLines();
        destroyTurnMarkers();
      }

      function initGuidePaths() {
        ctrl.guidePaths = [];
        var files = ctrl.memberSelection.getFiles();

        files.forEach(f => {
          let gp = new GuidePath(f, {
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

        removeTurnMarker(target);
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

      function onMouseMove(evt) {
        var adjustedPoint = ctrl.field.adjustMousePoint({ x: evt.e.layerX, y: evt.e.layerY });
        var stepPoint = new FieldPoint(adjustedPoint).toStepPoint(StrideType.SixToFive);

        var guidePoint = findGuidePoint(stepPoint);

        if (guidePoint) {
          createGuideline(guidePoint, stepPoint);
        } else {
          destroyGuideline();
        }
      }

      function findGuidePoint(stepPoint) {
        var guidePath = findGuidePath(stepPoint);
        if (!guidePath) return;

        return guidePath.lastPoint;
      }

      function findGuidePath(stepPoint) {
        return ctrl.guidePaths.find(p => p.isInPath(stepPoint));
      }

      function createGuideline(fromStepPoint, toStepPoint) {
        destroyGuideline();

        var from = new StepPoint(StrideType.SixToFive, fromStepPoint).toFieldPoint(),
          to = new StepPoint(StrideType.SixToFive, toStepPoint).toFieldPoint();

        ctrl.guideline = new fabric.Line([from.x, from.y, to.x, to.y], {
          stroke: 'black',
          strokeWidth: 2,
          strokeDashArray: [2, 2],
          selectable: false,
          evented: false
        });
        ctrl.field.canvas.add(ctrl.guideline);
        bringTurnMarkersToFront();
      }

      function destroyGuideline() {
        if (!ctrl.guideline) return;

        ctrl.field.canvas.remove(ctrl.guideline);
        ctrl.guideline = null;
      }

      function createGuidePathLines() {
        if (!ctrl.guidePaths) return;

        destroyGuidePathLines();
        ctrl.guidePaths.forEach(gp => {
          gp.path = new fabric.Path(gp.pathExpr, {
            stroke: 'black',
            strokeWidth: 2,
            strokeDashArray: [3, 3],
            fill: false,
            selectable: false,
            evented: false
          });
          ctrl.field.canvas.add(gp.path);
          bringTurnMarkersToFront();
        });
      }

      function destroyGuidePathLines() {
        if (!ctrl.guidePaths) return;

        ctrl.guidePaths.forEach(gp => {
          ctrl.field.canvas.remove(gp.path);
          gp.path = null;
        });
      }

      function bringTurnMarkersToFront() {
        newTurns.forEach(t => {
          ctrl.field.canvas.bringToFront(t.turnMarker);
        });
      }

      function addTurnMarker(stepPoint) {
        var guidePath = findGuidePath(stepPoint);

        if (!guidePath) return;

        var turnDirection = ctrl.turnDirection == undefined ? guidePath.lastPoint.direction : ctrl.turnDirection;

        // don't allow turn to be added if not on a guidepath
        if (!guidePath) return;

        if (turnDirection == Direction.CM) {
          return addCounterMarchMarker(guidePath, stepPoint);
        }

        guidePath.add({
          x: stepPoint.x,
          y: stepPoint.y,
          direction: turnDirection,
          strideType: StrideType.SixToFive,
          stepType: StepType.Full
        }); // add turn to guidepath  

        var fp = stepPoint.toFieldPoint();

        var tm = new TurnMarker(turnDirection, {
            left: fp.x,
            top: fp.y
          });

        ctrl.field.canvas.add(tm);

        var t = {
          turnMarker: tm,
          point: stepPoint
        };
        tm.turn = t;

        tm.on('moving', evt => {
          let adjustedPoint = ctrl.field.adjustMousePoint({ x: evt.e.layerX, y: evt.e.layerY });
          let newStepPoint = new FieldPoint(adjustedPoint).toStepPoint(StrideType.SixToFive);
          // update turn point
          tm.turn.point = newStepPoint;
        });

        newTurns.push(t);
        createGuidePathLines();

        return t;
      }

      function addCounterMarchMarker(guidePath, stepPoint) {

        var isLeftTurn = guidePath.getEndCount(stepPoint) % 2 == 0 ? true : false;

        var currentDir = guidePath.lastPoint.direction;
        var firstTurnDirection = isLeftTurn ? Direction.leftTurnDirection(currentDir) : Direction.rightTurnDirection(currentDir); 
        var secondTurnDirection = isLeftTurn ? Direction.leftTurnDirection(firstTurnDirection) : Direction.rightTurnDirection(firstTurnDirection); 
        var firstDelta = StepDelta.getDelta(StrideType.SixToFive, StepType.Half, firstTurnDirection, 2);
        
        guidePath.add({
          x: stepPoint.x,
          y: stepPoint.y,
          direction: firstTurnDirection,
          strideType: StrideType.SixToFive,
          stepType: StepType.Half
        }); 

        var secondDelta = StepDelta.getDelta(StrideType.SixToFive, StepType.Full, secondTurnDirection, 1);

        guidePath.add({
          x: stepPoint.x + firstDelta.deltaX,
          y: stepPoint.y + firstDelta.deltaY,
          direction: secondTurnDirection,
          strideType: StrideType.SixToFive,
          stepType: StepType.Full
        }); 

        var fp = stepPoint.toFieldPoint();

        var tm = new CounterMarch(currentDir, isLeftTurn, {
            left: fp.x,
            top: fp.y
          });

        ctrl.field.canvas.add(tm);

        var t = {
          turnMarker: tm,
          point: stepPoint
        };
        tm.turn = t;

        tm.on('moving', evt => {
          let adjustedPoint = ctrl.field.adjustMousePoint({ x: evt.e.layerX, y: evt.e.layerY });
          let newStepPoint = new FieldPoint(adjustedPoint).toStepPoint(StrideType.SixToFive);
          // update turn point
          tm.turn.point = newStepPoint;
        });

        newTurns.push(t);
        createGuidePathLines();

        return t;
      }

      function removeTurnMarker(target) {
        var index = newTurns.findIndex(t => {
          return t.turnMarker === target;
        });

        if (index >= 0) {
          var turn = newTurns[index];
          turn.turnMarker = null;
          target.turn = null;
          newTurns.splice(index, 1);
        }

        ctrl.field.canvas.remove(target);
      }

      function destroyTurnMarkers() {
        if (!newTurns) return;
        newTurns.forEach(t => {
          ctrl.field.canvas.remove(t.turnMarker);
          t.turnMarker = null;
        });
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
                // add turn to member script at count + steps
                // fm.member.script[count + p.stepsFromPrevious] = {
                //   strideType: p.strideType,
                //   stepType: p.stepType,
                //   direction: p.direction
                // };
                let action = new Action(p);
                let added = ScriptBuilder.addActionAtPoint(fm.member, action, p);
              });
            });
          }
        });
      
        $scope.$emit('addTurnsTool:save');
      }

      function reset() {
        console.log('reset');
        deactivate();
        activate(ctrl.memberSelection);
      }

      function positionTools(obj) {
        // TODO
        // * make this better
        // * take selected members in to account?
        // * handle error when no members

        // get leftmost marcher
        var leftmost = ctrl.field.getLeftmostMarcherPosition();

        var absCoords = ctrl.field.getAbsoluteCoords(leftmost);
        var left = absCoords.left - 100;
        if (left < 0) {
          left = absCoords.left + absCoords.width + 20;
        }
        var top = absCoords.top - 100;

        toolDiv.style.left = left + 'px';
        toolDiv.style.top = top + 'px';
      }




    }
  });


