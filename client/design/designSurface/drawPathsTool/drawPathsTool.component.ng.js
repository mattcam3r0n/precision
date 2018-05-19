'use strict';

import Events from '/client/lib/Events';
// import { FieldPoint } from '/client/lib/Point';
import Direction from '/client/lib/Direction';
import PathTool from './PathTool';
import ExceptionHelper from '/client/lib/ExceptionHelper';

angular.module('drillApp').component('drawPathsTool', {
  templateUrl:
    'client/design/designSurface/drawPathsTool/drawPathsTool.view.ng.html',
  bindings: {},
  controller: function(
    $scope,
    $window,
    appStateService,
    drillEditorService,
    eventService
  ) {
    let ctrl = this;

    ctrl.$onInit = function() {
      ctrl.subscriptions = eventService.createSubscriptionManager();
      ctrl.turnMode = 'block';
      ctrl.toolDiv = angular.element('.draw-paths-tool')[0];
      ctrl.fileOffset = 0;
      ctrl.rankOffset = 0;
      ctrl.allFiles = false;

      ctrl.subscriptions.subscribe(Events.drawPathsToolActivated, () => {
        activate(drillEditorService.getMemberSelection());
      });

      ctrl.subscriptions.subscribe(Events.strideTypeChanged, (evt, args) => {
        if (!ctrl.isActivated) return;
        activate(drillEditorService.getMemberSelection());
      });
    };

    ctrl.$onDestroy = function() {
      ctrl.field = null;
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
      drillEditorService.blurActiveElement();
    };

    ctrl.setAllFiles = function() {
      createPathTool();
      drillEditorService.blurActiveElement();
    };

    ctrl.setFileOffset = function() {
      ctrl.activePathTool.setFileOffset(ctrl.fileOffset);
    };

    ctrl.decrementFileOffset = function() {
      ctrl.fileOffset--;
      ctrl.activePathTool.setFileOffset(ctrl.fileOffset);
    };

    ctrl.incrementFileOffset = function() {
      ctrl.fileOffset++;
      ctrl.activePathTool.setFileOffset(ctrl.fileOffset);
    };

    ctrl.setRankOffset = function() {
      ctrl.activePathTool.setRankOffset(ctrl.rankOffset);
    };

    ctrl.decrementRankOffset = function() {
      ctrl.rankOffset--;
      ctrl.activePathTool.setRankOffset(ctrl.rankOffset);
    };

    ctrl.incrementRankOffset = function() {
      ctrl.rankOffset++;
      ctrl.activePathTool.setRankOffset(ctrl.rankOffset);
    };

    function activate(memberSelection) {
      ExceptionHelper.handle(
        () => {
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
          setTurnDirection(ctrl.turnDirection || Direction.E);
          // ctrl.field.canvas.on('mouse:up', onMouseUp);
          ctrl.subscriptions.subscribe(Events.deleteTurn, onBackspacePressed);
          ctrl.subscriptions.subscribe(Events.membersSelected, (evt, args) => {
            if (!ctrl.isActivated) return;
            ctrl.memberSelection = args.memberSelection;
            createPathTool();
          });
        },
        'drawPathsTool.activate',
        getContextInfo()
      );
    }

    function deactivate(notify = true) {
      ExceptionHelper.handle(
        () => {
          ctrl.subscriptions.unsubscribe(Events.deleteTurn);
          ctrl.subscriptions.unsubscribe(Events.membersSelected);

          ctrl.isActivated = false;
          ctrl.field.enablePositionIndicator();
          ctrl.field.canvas.selection = true;
          // ctrl.field.canvas.off('mouse:up', onMouseUp);
          ctrl.field.canvas.defaultCursor = 'default';
          destroyPathTool();
          eventService.notify(Events.updateField);
          ctrl.field.update();
          if (notify) {
            eventService.notify(Events.drawPathsToolDeactivated);
          }
        },
        'drawPathsTool.deactivate',
        getContextInfo()
      );
    }

    function setTurnDirection(direction) {
      dir = Direction.getDirection(direction);
      ctrl.turnDirection = dir;
      ctrl.field.canvas.defaultCursor =
        'url(/icons/' + Direction.getDirectionName(dir) + '.svg) 8 8, auto';
      ctrl.activePathTool.setCurrentTurnDirection(dir);
      drillEditorService.blurActiveElement();
    }

    function reset() {
      deactivate();
      activate(ctrl.memberSelection);
    }

    function createPathTool() {
      ExceptionHelper.handle(
        () => {
          if (ctrl.activePathTool) {
            destroyPathTool();
          }

          ctrl.activePathTool = new PathTool(
            ctrl.field,
            ctrl.memberSelection,
            ctrl.turnMode,
            ctrl.strideType,
            ctrl.allFiles,
            ctrl.fileOffset,
            ctrl.rankOffset
          );
          ctrl.activePathTool.setCurrentTurnDirection(ctrl.turnDirection);
          eventService.notify(Events.updateField);
        },
        'drawPathsTool.createPathTool',
        getContextInfo()
      );
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
    }

    // function destroyGuidePaths() {
    //   if (!ctrl.guidePaths) return;

    //   ctrl.guidePaths.forEach((gp) => gp.dispose());
    // }

    function save() {
      if (!ctrl.activePathTool) return;

      ExceptionHelper.handle(
        () => {
          ctrl.activePathTool.save();
          drillEditorService.save(true);
        },
        'drawPathsTool.save',
        getContextInfo()
      );
    }

    function getContextInfo() {
      return {
        drillId: appStateService.getDrillId(),
        drillName: appStateService.getDrillName(),
        drillCount: appStateService.getDrillCount(),
        strideType: ctrl.strideType,
        turnMode: ctrl.turnMode,
        turnDirection: ctrl.turnDirection,
      };
    }
  },
});
