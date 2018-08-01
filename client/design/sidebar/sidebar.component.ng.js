'use strict';

import Audio from '/client/lib/audio/Audio';
import Events from '/client/lib/Events';
import UndoManager from '/client/lib/UndoManager';

angular.module('drillApp').component('sidebar', {
  templateUrl: 'client/design/sidebar/sidebar.view.ng.html',
  bindings: {
    field: '<',
  },
  controller: function(
    $scope,
    appStateService,
    drillEditorService,
    confirmationDialogService,
    eventService
  ) {
    let ctrl = this;

    ctrl.$onInit = function() {
      const self = this;
      ctrl.subscriptions = eventService.createSubscriptionManager();
      initGridSwitch();
      initLogoSwitch();
      initCollapseHighlighting();
      ctrl.subscriptions.subscribe(
        Events.drawPathsToolDeactivated,
        collapseDrawPaths
      );
      ctrl.subscriptions.subscribe(
        Events.pinwheelToolDeactivated,
        collapsePinwheelTool
      );
      ctrl.subscriptions.subscribe(Events.showGrid, onShowGrid);
      ctrl.subscriptions.subscribe(Events.hideGrid, onHideGrid);
      ctrl.subscriptions.subscribe(Events.showLogo, onShowLogo);
      ctrl.subscriptions.subscribe(Events.hideLogo, onHideLogo);

      $('#undo-button, #redo-button').on('show.bs.tooltip', function() {
        // Only one tooltip should ever be open at a time
        $('.tooltip')
          .not(self)
          .hide(); // eslint-disable-line
      });
    };

    ctrl.$onDestroy = function() {
      ctrl.subscriptions.unsubscribeAll();
    };

    $scope.undo = function() {
      UndoManager.undo();
    };

    $scope.undoLabel = function() {
      if (!UndoManager.hasUndo()) return 'Nothing to Undo';
      return 'Undo ' + UndoManager.getUndoLabel();
    };

    $scope.redoLabel = function() {
      if (!UndoManager.hasRedo()) return 'Nothing to Redo';
      return 'Redo ' + UndoManager.getRedoLabel();
    };

    $scope.redo = function() {
      UndoManager.redo();
    };

    $scope.addMembers = function() {
      // always go to beginning when adding new marchers
      drillEditorService.goToBeginning();
      eventService.notify(Events.addMembersToolActivated);
    };

    $scope.deleteSelectedMembers = function() {
      const selection = drillEditorService.getMemberSelection();
      if (selection.members.length === 0) return;

      confirmationDialogService
        .show({
          heading: 'Delete Marchers',
          message: 'Delete ' + selection.members.length + ' marchers?',
          confirmText: 'Delete',
        })
        .then((result) => {
          if (result.confirmed) {
            drillEditorService.deleteSelectedMembers();
          }
        });
    };

    $scope.marcherColors = function() {
      eventService.notify(Events.activateMarcherColorsTool);
    };

    $scope.addSteps = function() {
      eventService.notify(Events.addStepsToolActivated);
    };

    $scope.drawPaths = function() {
      eventService.notify(Events.drawPathsToolActivated);
    };

    $scope.pinwheel = function() {
      eventService.notify(Events.activatePinwheelTool);
    };

    $scope.deselectAll = function() {
      drillEditorService.deselectAll();
    };

    $scope.selectAll = function() {
      drillEditorService.selectAll();
    };

    $scope.deleteBackspace = function() {
      drillEditorService.deleteBackspace();
    };

    $scope.deleteForward = function() {
      drillEditorService.deleteForward();
    };

    $scope.showFootprints = function() {
      drillEditorService.showFootprints();
    };

    $scope.hideUnselected = function() {
      drillEditorService.hideUnselected();
    };

    $scope.showAll = function() {
      drillEditorService.showAll();
    };

    $scope.addMusic = function() {
      Audio.init().then(()=>{
        eventService.notify(Events.chooseMusicDialogActivated);
      });
    };

    $scope.sizeToFit = function() {
      eventService.notify(Events.sizeToFit);
    };

    $scope.zoomIn = function() {
      eventService.notify(Events.zoomIn);
    };

    $scope.zoomOut = function() {
      eventService.notify(Events.zoomOut);
    };

    $scope.countermarch = function() {
      eventService.notify(Events.activateCountermarchTool);
    };

    $scope.toTheRears = function() {
      eventService.notify(Events.activateToTheRearsTool);
    };

    $scope.stepTwo = function() {
      eventService.notify(Events.activateStepTwoTool);
    };

    $scope.illinois = function() {
      eventService.notify(Events.activateIllinoisTool);
    };

    $scope.texasTurn = function() {
      eventService.notify(Events.activateTexasTurnTool);
    };

    $scope.column = function() {
      eventService.notify(Events.activateColumnTool);
    };

    $scope.waterfall = function() {
      eventService.notify(Events.activateWaterfallTool);
    };

    $scope.squirrelCage = function() {
      eventService.notify(Events.activateSquirrelCageTool);
    };

    $scope.fastBreak = function() {
      eventService.notify(Events.activateFastBreakTool);
    };

    function initGridSwitch() {
      $('[name=\'grid-switch\']').bootstrapSwitch('state', false);
      $('input[name=\'grid-switch\']').on(
        'switchChange.bootstrapSwitch',
        function(event, state) {
          appStateService.isGridVisible = state;
          appStateService.updateUserProfile();
          state
            ? eventService.notify(Events.showGrid)
            : eventService.notify(Events.hideGrid);
        }
      );
    }

    function onShowGrid() {
      // sync switch with grid change
      // third 'true' skips firing of switchChange
      $('[name=\'grid-switch\']').bootstrapSwitch('state', true, true);
    }

    function onHideGrid() {
      // sync switch with grid change
      // third 'true' skips firing of switchChange
      $('[name=\'grid-switch\']').bootstrapSwitch('state', false, true);
    }

    function initLogoSwitch() {
      $('[name=\'logo-switch\']').bootstrapSwitch('state', true);
      $('input[name=\'logo-switch\']').on(
        'switchChange.bootstrapSwitch',
        function(event, state) {
          appStateService.isLogoVisible = state;
          appStateService.updateUserProfile();
          state
            ? eventService.notify(Events.showLogo)
            : eventService.notify(Events.hideLogo);
        }
      );
    }

    function onShowLogo() {
      // sync switch with logo change
      // third 'true' skips firing of switchChange
      $('[name=\'logo-switch\']').bootstrapSwitch('state', true, true);
    }

    function onHideLogo() {
      // sync switch with logo change
      // third 'true' skips firing of switchChange
      $('[name=\'logo-switch\']').bootstrapSwitch('state', false, true);
    }

    function initCollapseHighlighting() {
      // add class to highlight opened menu
      $('div.collapse').on('hidden.bs.collapse', function(args) {
        $(args.currentTarget.parentElement).removeClass('opened');
      });
      $('div.collapse').on('shown.bs.collapse', function(args) {
        $(args.currentTarget.parentElement).addClass('opened');
      });
    }

    function collapseDrawPaths() {
      $('#drawPaths').collapse('hide');
    }

    function collapsePinwheelTool() {
      $('#pinwheel').collapse('hide');
    }
  },
});
