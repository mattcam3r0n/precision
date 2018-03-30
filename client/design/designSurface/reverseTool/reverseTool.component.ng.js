'use strict';

import Events from '/client/lib/Events';

angular.module('drillApp')
  .component('reverseTool', {
    // eslint-disable-next-line max-len
    templateUrl: 'client/design/designSurface/reverseTool/reverseTool.view.ng.html',
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

        ctrl.subscriptions = eventService.createSubscriptionManager();

        ctrl.subscriptions.subscribe(Events.activateReverseTool,
          (evt, args) => {
            activate(drillEditorService.getMemberSelection());
          });

        ctrl.countsToSkip = 0;
        ctrl.countsToReverse = 8;
      };

      ctrl.$onDestroy = function() {
        ctrl.field = null;
        ctrl.subscriptions.unsubscribeAll();
      };

      $scope.save = function() {
        save();
        deactivate();
      };

      ctrl.setCountsToSkip = function(counts) {
          ctrl.countsToSkip = counts;
      };

      ctrl.setCountsToReverse = function(counts) {
          ctrl.countsToReverse = counts;
      };

      $scope.cancel = deactivate;

      function activate(memberSelection) {
        if (ctrl.isActivated) {
          deactivate();
        }

        appStateService.setActiveTool('reverseSteps', () => {
          deactivate(false);
        });

        ctrl.isActivated = true;
        ctrl.field = appStateService.field;
        ctrl.memberSelection = memberSelection;
        ctrl.strideType = drillEditorService.strideType;
        ctrl.subscriptions.subscribe(Events.membersSelected, (evt, args) => {
          if (!ctrl.isActivated) return;
          ctrl.memberSelection = drillEditorService.getMemberSelection();
          eventService.notify(Events.drillStateChanged);
        });
      }

      function deactivate(notify = true) {
        ctrl.subscriptions.unsubscribe(Events.membersSelected);

        ctrl.isActivated = false;
        ctrl.field.canvas.selection = true;
        ctrl.field.canvas.defaultCursor = 'default';
        eventService.notify(Events.updateField);
        if (notify) {
          eventService.notify(Events.reverseToolDeactivated);
        }
      }

      function save() {
        const members = ctrl.memberSelection.members;

        drillEditorService.reverseSteps(drillEditorService.currentCount, ctrl.countsToReverse, ctrl.countsToSkip, members);

        deactivate();
      }
    },
  });


