'use strict';

import Events from '/client/lib/Events';
import UndoManager from '/client/lib/UndoManager';

angular.module('drillApp')
  .component('designHeader', {
    templateUrl: 'client/design/header/header.component.ng.html',
    bindings: {
    },
    controller: function($scope,
              $location,
              eventService,
              appStateService,
              drillEditorService,
              userService
            ) {
      let ctrl = this;

      ctrl.$onInit = function() {
        // $('[data-toggle="tooltip"]').tooltip();
        ctrl.subscriptions = eventService.subscribe(Events.drillOpened,
              onDrillOpened);
      };

      ctrl.$onChanges = function(changes) {
        $scope.drillName = drillEditorService.drill.name;
      };

      ctrl.$onDestroy = function() {

      };

      ctrl.onNewDrill = function() {
        eventService.notify(Events.newDrill);
      };

      ctrl.onOpenDrill = function() {
        eventService.notify(Events.showOpenDrillDialog);
      };

      ctrl.onDrillProperties = function() {
        eventService.notify(Events.showDrillPropertiesDialog);
      };

      ctrl.onDebug = function() {
        console.log(drillEditorService.drill);
      };

      ctrl.focusDrillName = function() {
        angular.element('#txtDrillName').focus();
      };

      ctrl.drillName = function() {
        if (!drillEditorService.drill) return;

        return drillEditorService.drill.name;
      };

      ctrl.userName = function() {
        return userService.getUserEmail();
      };

      ctrl.isAdmin = function() {
        return userService.isAdmin();
      };

      ctrl.goToAdmin = function() {
        $location.path('/admin');
      };

      ctrl.logOut = function() {
        userService.logOut();
      };

      ctrl.undo = function() {
        UndoManager.undo();
      };

      ctrl.undoLabel = function() {
        if (!UndoManager.hasUndo()) return 'Undo';
        return 'Undo ' + UndoManager.getUndoLabel();
      };

      ctrl.hasUndo = function() {
        return UndoManager.hasUndo();
      };

      ctrl.redo = function() {
        UndoManager.redo();
      };

      ctrl.redoLabel = function() {
        if (!UndoManager.hasRedo()) return 'Redo';
        return 'Redo ' + UndoManager.getRedoLabel();
      };

      ctrl.hasRedo = function() {
        return UndoManager.hasRedo();
      };

      $scope.onNameChange = function() {
        appStateService.drill.name = $scope.drillName;
        drillEditorService.save(true);
      };

      function onDrillOpened() {
        $scope.drillName = appStateService.drill.name;
      }
    },
  });
