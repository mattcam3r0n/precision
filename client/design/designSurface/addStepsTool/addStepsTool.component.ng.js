'use strict';

import StrideType from '/client/lib/StrideType';
import StepType from '/client/lib/StepType';
import Direction from '/client/lib/Direction';
import Events from '/client/lib/Events';

angular.module('drillApp')
  .component('addStepsTool', {
    templateUrl: 'client/design/designSurface/addStepsTool/addStepsTool.view.ng.html',
    bindings: {
    },
    controller: function($scope, drillEditorService,
        eventService, appStateService, confirmationDialogService) {
      let ctrl = this;

      ctrl.$onInit = function() {
        ctrl.isActivated = false;
        ctrl.subscriptions = eventService.createSubscriptionManager();
        ctrl.subscriptions
          .subscribe(Events.addStepsToolActivated, (evt, args) => {
            activate(drillEditorService.getMemberSelection());
          });

        ctrl.toolDiv = angular.element('.add-steps-tool')[0];

        initStrideTypeSwitch();

        $('[data-toggle="tooltip"]').tooltip();

        $scope.strideType = drillEditorService.strideType;
      };

      ctrl.$onDestroy = function() {
        ctrl.subscriptions.unsubscribeAll();
      };

      $scope.activate = activate;

      $scope.cancel = deactivate;

      $scope.deactivate = function() {
      };

      $scope.reset = function() {
        reset();
      };

      $scope.getStrideType = function() {
        return drillEditorService.strideType;
      };

      $scope.addStep = function(dir) {
        drillEditorService.addStep({ direction: Direction[dir] });
      };

      $scope.addCountermarch = function() {
        drillEditorService.addCountermarch();
      };

      $scope.addLeftCountermarch = () => {
        drillEditorService.addLeftCountermarch();
      };

      $scope.addRightCountermarch = () => {
        drillEditorService.addRightCountermarch();
      };

      $scope.addLeftFace = () => {
        drillEditorService.addLeftFace();
      };

      $scope.addRightFace = () => {
        drillEditorService.addRightFace();
      };

      $scope.addAboutFace2 = () => {
        drillEditorService.addAboutFace2();
      };

      $scope.addAboutFace3 = () => {
        drillEditorService.addAboutFace3();
      };

      $scope.addDragSteps = () => {
        // activate drag step tool
        eventService.notify(Events.activateDragStepTool);
      };

      $scope.addPinwheel = () => {
        // activate pinwheel tool in pinwheel mode
        eventService.notify(Events.activatePinwheelTool, {
          mode: 'pinwheel',
        });
      };

      $scope.addGate = () => {
        // activate pinwheel tool in gate mode
        eventService.notify(Events.activatePinwheelTool, {
          mode: 'gate',
        });
      };

      $scope.addMarkTime = function() {
        drillEditorService.addStep({
          direction: null,
          stepType: StepType.MarkTime,
        });
      };

      $scope.addHalt = function() {
        // using null direction so it will default to current dir
        drillEditorService.addStep({
          direction: null,
          stepType: StepType.Halt,
        });
      };

      $scope.backspaceDelete = function() {
        drillEditorService.deleteBackspace();
      };

      $scope.deleteCount = function() {
        drillEditorService.deleteCount();
      };

      $scope.clearCount = function() {
        drillEditorService.clearCount();
      };

      $scope.deleteForward = function() {
        confirmationDialogService.show({
          heading: 'Delete Forward',
          message: 'This will delete all counts for the selected marchers from the current count forward. Click Delete to proceed.',
          confirmText: 'Delete',
        }).then((result) => {
          if (result.confirmed) {
            drillEditorService.deleteForward();
          }
        });
      };

      function activate(memberSelection) {
        if (ctrl.isActivated) {
          deactivate();
        }

        appStateService.setActiveTool('addSteps', () => {
          deactivate(false);
        });

        ctrl.isActivated = true;
        ctrl.memberSelection = memberSelection;
      }

      function deactivate(notify = true) {
        ctrl.isActivated = false;
        // TODO: use events to signal this, if still needed?
        // ctrl.field.enablePositionIndicator();
        // ctrl.field.canvas.selection = true;
        // ctrl.field.canvas.defaultCursor = 'default';
      }

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
        // FOR NOW, leave switch disabled
        $('[name=\'stride-type-switch\']').bootstrapSwitch('disabled', true);
      }
    },
  });


