'use strict';

import Events from '/client/lib/Events';
import EventSubscriptionManager from '/client/lib/EventSubscriptionManager';
import StrideType from '/client/lib/StrideType';

angular.module('drillApp')
  .component('sidebar', {
    templateUrl: 'client/design/sidebar/sidebar.view.ng.html',
    bindings: {
      field: '<',
    },
    controller: function($scope,
                          appStateService,
                          drillEditorService,
                          eventService) {
      let ctrl = this;

      ctrl.$onInit = function() {
        ctrl.subscriptions = new EventSubscriptionManager(eventService);
        initStrideTypeSwitch();
        initGridSwitch();
        initLogoSwitch();
        initCollapseHighlighting();
        ctrl.subscriptions
          .subscribe(Events.drawPathsToolDeactivated, collapseDrawPaths);
        ctrl.subscriptions
          .subscribe(Events.pinwheelToolDeactivated, collapsePinwheelTool);
        ctrl.subscriptions.subscribe(Events.showGrid, onShowGrid);
        ctrl.subscriptions.subscribe(Events.hideGrid, onHideGrid);
        ctrl.subscriptions.subscribe(Events.showLogo, onShowLogo);
        ctrl.subscriptions.subscribe(Events.hideLogo, onHideLogo);
      };

      ctrl.$onDestroy = function() {
        ctrl.subscriptions.unsubscribeAll();
      };

      $scope.addMembers = function() {
        eventService.notify(Events.addMembersToolActivated);
      };

      $scope.deleteSelectedMembers = function() {
        drillEditorService.deleteSelectedMembers();
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

      $scope.showPaths = function() {
        drillEditorService.showPaths();
      };

      $scope.hideUnselected = function() {
        drillEditorService.hideUnselected();
      };

      $scope.showAll = function() {
        drillEditorService.showAll();
      };

      $scope.addMusic = function() {
        eventService.notify(Events.chooseMusicDialogActivated);
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

      function initStrideTypeSwitch() {
        // bootstrap toggle button
        $('[name=\'stride-type-switch\']')
          .bootstrapSwitch('state', drillEditorService.strideType);
        $('input[name=\'stride-type-switch\']')
          .on('switchChange.bootstrapSwitch', function(event, state) {
            if (state) {
              drillEditorService.strideType = StrideType.EightToFive;
            } else {
              drillEditorService.strideType = StrideType.SixToFive;
            }
            // sync other stride switches
            $('[name=\'stride-type-switch\']')
              .bootstrapSwitch('state', state, true);
          });
      }

      function initGridSwitch() {
        $('[name=\'grid-switch\']').bootstrapSwitch('state', false);
        $('input[name=\'grid-switch\']')
          .on('switchChange.bootstrapSwitch', function(event, state) {
            appStateService.isGridVisible = state;
            state
              ? eventService.notify(Events.showGrid)
              : eventService.notify(Events.hideGrid);
          });
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
        $('input[name=\'logo-switch\']')
          .on('switchChange.bootstrapSwitch', function(event, state) {
              appStateService.isLogoVisible = state;
            state
              ? eventService.notify(Events.showLogo)
              : eventService.notify(Events.hideLogo);
          });
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


