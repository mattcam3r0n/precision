'use strict';

import Events from '/client/lib/Events';
import EventSubscriptionManager from '/client/lib/EventSubscriptionManager';
import DragStepCalculator from './DragStepCalculator';

angular.module('drillApp')
  .component('dragStepTool', {
    // eslint-disable-next-line max-len
    templateUrl: 'client/design/designSurface/dragStepTool/dragStepTool.view.ng.html',
    bindings: {
    },
    controller: function($scope,
                        $window,
                        appStateService,
                        drillEditorService,
                        eventService) {
      let ctrl = this;

      ctrl.$onInit = function() {
        $('[data-toggle="tooltip"]').tooltip();

        ctrl.subscriptions = new EventSubscriptionManager(eventService);

        ctrl.subscriptions.subscribe(Events.activateDragStepTool,
          (evt, args) => {
            activate(drillEditorService.getMemberSelection());
          });

        ctrl.rotationDirection = 'clockwise';
        ctrl.rotationAngle = .5; // 1/4, 1/2, 3/4, full
        ctrl.counts = 8;
      };

      ctrl.$onDestroy = function() {
        ctrl.subscriptions.unsubscribeAll();
      };

      $scope.save = function() {
        save();
        deactivate();
      };

      ctrl.setCounts = function(counts) {
        if (counts) {
          ctrl.counts = counts;
        }
        createDragStepCalculator();
      };

      ctrl.setRotation = function(rotationPct) {
        ctrl.rotationAngle = rotationPct * 2;
        // ctrl.counts = rotationPct * 32;
        createDragStepCalculator();
      };

      ctrl.setDirection = function(dir) {
        ctrl.rotationDirection = dir;
        createDragStepCalculator();
      };

      ctrl.isClockwise = function() {
        return ctrl.rotationDirection == 'clockwise';
      };

      ctrl.isCounterClockwise = function() {
        return ctrl.rotationDirection == 'counter-clockwise';
      };

      ctrl.isRotation = function(r) {
        return ctrl.rotationAngle / 2 == r;
      };

      $scope.cancel = deactivate;

      function activate(memberSelection) {
        if (ctrl.isActivated) {
          deactivate();
        }

        appStateService.setActiveTool('dragStep', () => {
          deactivate(false);
        });

        ctrl.isActivated = true;
        ctrl.field = appStateService.field;
        ctrl.memberSelection = memberSelection;
        ctrl.pivotMember = memberSelection.members[0];
        ctrl.strideType = drillEditorService.strideType;
        ctrl.subscriptions.subscribe(Events.membersSelected, (evt, args) => {
          if (!ctrl.isActivated) return;
          ctrl.pivotMember = args.members[0];
          ctrl.pivotMember.isSelected = true;
          ctrl.memberSelection = drillEditorService.getMemberSelection();
          eventService.notify(Events.drillStateChanged);
          createDragStepCalculator();
        });

        createDragStepCalculator();
      }

      function deactivate(notify = true) {
        if (ctrl.dragStepCalculator) {
          ctrl.dragStepCalculator.dispose();
        }
        ctrl.subscriptions.unsubscribe(Events.membersSelected);

        ctrl.isActivated = false;
        ctrl.field.canvas.selection = true;
        ctrl.field.canvas.defaultCursor = 'default';
        eventService.notify(Events.updateField);
        if (notify) {
          eventService.notify(Events.dragStepToolDeactivated);
        }
      }

      function createDragStepCalculator() {
        if (ctrl.dragStepCalculator) {
          ctrl.dragStepCalculator.dispose();
        }

        ctrl.dragStepCalculator = new DragStepCalculator(ctrl.memberSelection.members); // eslint-disable-line max-len
        ctrl.field.update();
      }

      function save() {
        const memberSteps = ctrl.dragStepCalculator
                                .calculateSteps(ctrl.rotationDirection,
                                              ctrl.rotationAngle,
                                              ctrl.counts);

        ctrl.memberSelection.members.forEach((member) => {
          let steps = memberSteps[member.id];
          drillEditorService.addMemberSteps(member, steps);
        });

        drillEditorService.save(true);
        drillEditorService.notifyDrillStateChanged();
        deactivate();
      }
    },
  });


