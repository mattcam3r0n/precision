'use strict';

import Events from '/client/lib/Events';
import UndoManager from '/client/lib/UndoManager';

angular.module('drillApp').component('designHeader', {
  templateUrl: 'client/design/header/header.component.ng.html',
  bindings: {},
  controller: function(
    $scope,
    $location,
    $rootScope,
    eventService,
    appStateService,
    drillEditorService,
    userService
  ) {
    let ctrl = this;

    ctrl.$onInit = function() {
      // $('[data-toggle="tooltip"]').tooltip();
      ctrl.subscriptions = eventService.createSubscriptionManager();

      ctrl.subscriptions.subscribe(Events.drillOpened, onDrillOpened);

      ctrl.subscriptions.subscribe(Events.drillDeleted, onDrillDeleted);

      ctrl.subscriptions.subscribe(
        Events.drillPropertiesChanged,
        onDrillPropertiesChanged
      );

      ctrl.subscriptions.subscribe(Events.drillSavedAs, onDrillSavedAs);

      // $scope.subscribe('recentDrills', function() {
      //   return [{
      //   }, $scope.getReactively('drillId')];
      // });

      // $scope.helpers({
      //   recentDrills: function() {
      //     return Meteor.call('getRecentDrills');
      //   },
      // });
    };

    ctrl.$onChanges = function(changes) {
      $scope.drillName = drillEditorService.drill.name;
    };

    ctrl.$onDestroy = function() {
      ctrl.subscriptions.unsubscribeAll();
    };

    ctrl.onNewDrill = function() {
      eventService.notify(Events.newDrill);
    };

    ctrl.onOpenDrill = function() {
      eventService.notify(Events.showOpenDrillDialog);
    };

    ctrl.openDrill = function(id) {
      // console.log('header.openDrill');
      eventService.notify(Events.showSpinner);
      appStateService.openDrill(id).then((drill) => {
        eventService.notify(Events.hideSpinner);
      });
    };

    ctrl.onSave = function() {
      // save immediately
      appStateService.saveDrill();
    };

    ctrl.onSaveAs = function() {
      eventService.notify(Events.showSaveAsDialog);
    };

    ctrl.onShare = function() {
      eventService.notify(Events.showShareDialog);
    };

    ctrl.onPrintCharts = function() {
      eventService.notify(Events.showPrintChartsDialog);
    };

    ctrl.onDrillProperties = function() {
      eventService.notify(Events.showDrillPropertiesDialog);
    };

    ctrl.onDebug = function() {
      console.log(drillEditorService.drill);
    };

    ctrl.showIntro = function() {
      eventService.notify(Events.showIntroDialog);
    };

    ctrl.showReleaseNotes = function() {
      eventService.notify(Events.showReleaseNotesDialog);
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

    ctrl.showKeyboardShortcuts = function() {
      eventService.notify(Events.showKeyboardShortcuts);
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

    function getRecentDrills() {
      Meteor.callPromise('getRecentDrills').then((recentDrills) => {
        $scope.recentDrills = recentDrills;
        $rootScope.$safeApply();
      });
    }

    function onDrillOpened(evt, args) {
      $scope.drillName = appStateService.drill.name;
      getRecentDrills();
    }

    function onDrillDeleted(evt, args) {
      getRecentDrills();
    }

    function onDrillSavedAs(evt, args) {
      $scope.drillId = appStateService.drill._id;
      $scope.drillName = appStateService.drill.name;
    }

    function onDrillPropertiesChanged(evt, args) {
      $scope.drillName = appStateService.drill.name;
    }
  },
});
