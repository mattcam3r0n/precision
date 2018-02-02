'use strict';

import Events from '/client/lib/Events';
import EventSubscriptionManager from '/client/lib/EventSubscriptionManager';
import PinwheelIndicator from './PinwheelIndicator';

angular.module('drillApp')
  .component('pinwheelTool', {
    // eslint-disable-next-line max-len
    templateUrl: 'client/design/designSurface/pinwheelTool/pinwheelTool.view.ng.html',
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

        ctrl.subscriptions.subscribe(Events.activatePinwheelTool,
          (evt, args) => {
            activate(drillEditorService.getMemberSelection(), args.mode);
          });

        ctrl.subscriptions.subscribe(Events.objectsSelected, (evt, args) => {
          if (!ctrl.isActivated) return;
          ctrl.pivotMember = args.members[0];
          ctrl.pivotMember.isSelected = true;
          ctrl.memberSelection = drillEditorService.getMemberSelection();
          eventService.notify(Events.drillStateChanged);
          createPinwheelIndicator();
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
        createPinwheelIndicator();
      };

      ctrl.setRotation = function(rotationPct) {
        ctrl.rotationAngle = rotationPct * 2;
        ctrl.counts = rotationPct * 32;
        createPinwheelIndicator();
      };

      ctrl.setDirection = function(dir) {
        ctrl.rotationDirection = dir;
        createPinwheelIndicator();
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

      function activate(memberSelection, mode) {
        if (ctrl.isActivated) {
          deactivate();
        }

        appStateService.setActiveTool('pinwheel', () => {
          deactivate(false);
        });

        ctrl.isActivated = true;
        ctrl.mode = mode || 'gate';
        ctrl.field = appStateService.field;
        ctrl.memberSelection = memberSelection;
        ctrl.pivotMember = getPivotMember(memberSelection, ctrl.mode); // memberSelection.members[0];
        ctrl.strideType = drillEditorService.strideType;
        ctrl.field.disablePositionIndicator();
        // TODO: should we allow selection while this tool is active?
        ctrl.subscriptions.subscribe(Events.membersSelected, (evt, args) => {
          if (!ctrl.isActivated) return;
          ctrl.memberSelection = args.memberSelection;
        });

        createPinwheelIndicator();
      }

      function deactivate(notify = true) {
        if (ctrl.pinwheelIndicator) {
          ctrl.pinwheelIndicator.dispose();
        }
        ctrl.subscriptions.unsubscribe(Events.membersSelected);

        ctrl.isActivated = false;
        ctrl.field.enablePositionIndicator();
        ctrl.field.canvas.selection = true;
        ctrl.field.canvas.defaultCursor = 'default';
        eventService.notify(Events.updateField);
        if (notify) {
          eventService.notify(Events.pinwheelToolDeactivated);
        }
      }

      function getPivotMember(memberSelection, mode) {
        let pivotPoint;
        if (mode === 'pinwheel') {
          const upperLeft = memberSelection.getUpperLeft();
          const bottomRight = memberSelection.getBottomRight();
          pivotPoint = {
            x: (upperLeft.x + bottomRight.x) / 2,
            y: (upperLeft.y + bottomRight.y) / 2,
          };
        } else {
          pivotPoint = memberSelection.getUpperLeft();
        }
        return memberSelection.getClosestMember(pivotPoint);
      }

      function createPinwheelIndicator() {
        if (ctrl.pinwheelIndicator) {
          ctrl.pinwheelIndicator.dispose();
        }

        ctrl.pinwheelIndicator = new PinwheelIndicator(ctrl.field,
          ctrl.pivotMember,
          ctrl.memberSelection.members,
          ctrl.rotationDirection,
          ctrl.rotationAngle,
          ctrl.counts
        );
        ctrl.field.update();
      }

      function save() {
        ctrl.memberSelection.members.forEach((member) => {
          let steps = ctrl.pinwheelIndicator.steps[member.id];
          drillEditorService.addMemberSteps(member, steps);
        });

        drillEditorService.save(true);
        deactivate();
      }
    },
  });


