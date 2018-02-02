'use strict';

import Events from '/client/lib/Events';
import EventSubscriptionManager from '/client/lib/EventSubscriptionManager';
import { FieldPoint } from '/client/lib/Point';
import Direction from '/client/lib/Direction';
import PathTool from './PathTool';

angular.module('drillApp')
  .component('drawPathsTool', {
    templateUrl: 'client/design/designSurface/drawPathsTool/drawPathsTool.view.ng.html',
    bindings: {
    },
    controller: function($scope, $window, appStateService,
          drillEditorService, eventService) {
      let ctrl = this;

      ctrl.$onInit = function() {
        ctrl.subscriptions = new EventSubscriptionManager(eventService);
        ctrl.turnMode = 'block';
        ctrl.toolDiv = angular.element('.draw-paths-tool')[0];

        ctrl.subscriptions.subscribe(Events.drawPathsToolActivated, () => {
          activate(drillEditorService.getMemberSelection());
        });

        ctrl.subscriptions.subscribe(Events.strideTypeChanged, (evt, args) => {
          if (!ctrl.isActivated) return;
          activate(drillEditorService.getMemberSelection());
        });
      };

      ctrl.$onDestroy = function() {
        ctrl.subscriptions.unsubscribeAll();
      };

      $scope.save = function() {
        save();
        deactivate();
      };

      $scope.cancel = deactivate;

      $scope.reset = function() {
        reset();
      };

      $scope.isCurrentDirection = function(dir) {
        return ctrl.turnDirection == Direction[dir];
      };

      $scope.setTurnDirection = setTurnDirection;

      $scope.isBlockMode = function() {
        return ctrl.turnMode == 'block';
      };

      $scope.isFileMode = function() {
        return ctrl.turnMode == 'file';
      };

      $scope.setTurnMode = function(mode) {
        ctrl.turnMode = mode;
        createPathTool();
      };

      function activate(memberSelection) {
        if (ctrl.isActivated) {
          deactivate(false);
        }

        appStateService.setActiveTool('drawPaths', () => {
          deactivate(false);
        });

        ctrl.isActivated = true;
        ctrl.field = appStateService.field;
        ctrl.memberSelection = memberSelection;
        ctrl.strideType = drillEditorService.strideType;

        createPathTool();

        ctrl.field.disablePositionIndicator();
        setTurnDirection(Direction.E);
        ctrl.field.canvas.on('mouse:up', onMouseUp);
        ctrl.subscriptions.subscribe(Events.deleteTurn, onBackspacePressed);
        ctrl.subscriptions.subscribe(Events.membersSelected, (evt, args) => {
          if (!ctrl.isActivated) return;
          ctrl.memberSelection = args.memberSelection;
          createPathTool();
        });
      }

      function deactivate(notify = true) {
        ctrl.subscriptions.unsubscribe(Events.deleteTurn);
        ctrl.subscriptions.unsubscribe(Events.membersSelected);

        ctrl.isActivated = false;
        ctrl.field.enablePositionIndicator();
        ctrl.field.canvas.selection = true;
        ctrl.field.canvas.off('mouse:up', onMouseUp);
        ctrl.field.canvas.defaultCursor = 'default';
        destroyPathTool();
        eventService.notify(Events.updateField);
        ctrl.field.update();
        if (notify) {
          eventService.notify(Events.drawPathsToolDeactivated);
        }
      }

      function setTurnDirection(direction) {
        dir = Direction.getDirection(direction);
        ctrl.turnDirection = dir;
        ctrl.field.canvas.defaultCursor = 'url(/icons/' + Direction.getDirectionName(dir) + '.svg) 8 8, auto';
        ctrl.activePathTool.setCurrentTurnDirection(Direction[dir]);
      }

      function reset() {
        deactivate();
        activate(ctrl.memberSelection);
      }

      function createPathTool() {
        // if (ctrl.memberSelection.members.length == 0) return;

        if (ctrl.activePathTool) {
          destroyPathTool();
        }

        ctrl.activePathTool = new PathTool(ctrl.field, ctrl.memberSelection,
            ctrl.turnMode, ctrl.strideType);
        eventService.notify(Events.updateField);
      }

      function destroyPathTool() {
        if (!ctrl.activePathTool) return;

        ctrl.activePathTool.dispose();
      }

      function onBackspacePressed(evt) {
        // how to get corresponding turn?
        if (!ctrl.field.canvas.getActiveObject()) return;

        let target = ctrl.field.canvas.getActiveObject();

        // removeTurnMarker(target);
        ctrl.activePathTool.removeTurnMarker(target);
        //        ctrl.guidePaths.forEach(gp => gp.removeTurnMarker(target));
      }

      function onMouseUp(evt) {
        if (!evt.isClick) return;
        if (evt.target !== null && !evt.target.isLogo) return; // clicked on an object

        // have to adjust point for zoom
        let adjustedPoint = ctrl.field.adjustMousePoint({
          x: evt.e.layerX,
          y: evt.e.layerY,
        });
        let stepPoint = new FieldPoint(adjustedPoint); // .toStepPoint(ctrl.strideType);

        // add turn at step point
        ctrl.activePathTool.addTurnMarker(ctrl.turnDirection, stepPoint);
      }

      // function destroyGuidePaths() {
      //   if (!ctrl.guidePaths) return;

      //   ctrl.guidePaths.forEach((gp) => gp.dispose());
      // }

      function save() {
        if (!ctrl.activePathTool) return;

        ctrl.activePathTool.save();

        drillEditorService.save(true);
      }
    },
  });


