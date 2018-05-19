'use strict';

import Events from '/client/lib/Events';

angular.module('drillApp')
  .component('countermarchTool', {
    // eslint-disable-next-line max-len
    templateUrl: 'client/design/designSurface/maneuvers/countermarch/countermarchTool.view.ng.html',
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

        ctrl.subscriptions.subscribe(Events.activateCountermarchTool,
          (evt, args) => {
            activate(drillEditorService.getMemberSelection());
          });

        ctrl.countermarchDirection = 'left';
        ctrl.fileDelayDirection = 'left-to-right';
        ctrl.fileDelay = 0;
        ctrl.rankDelay = 0;
      };

      ctrl.$onDestroy = function() {
        ctrl.field = null;
        ctrl.subscriptions.unsubscribeAll();
      };

      $scope.save = function() {
        save();
        deactivate();
      };

      ctrl.setCountermarchDirection = function(dir) {
        ctrl.countermarchDirection = dir;
        drillEditorService.blurActiveElement();
      };

      ctrl.setFileDelay = function(counts) {
          ctrl.fileDelay = counts;
      };

      ctrl.setFileDelayDirection = function(dir) {
        ctrl.fileDelayDirection = dir;
        drillEditorService.blurActiveElement();
      };

      ctrl.setRankDelay = function(counts) {
          ctrl.rankDelay = counts;
      };

      $scope.cancel = deactivate;

      function activate(memberSelection) {
        if (ctrl.isActivated) {
          deactivate();
        }

        appStateService.setActiveTool('countermarchTool', () => {
          deactivate(false);
        });

        ctrl.isActivated = true;
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
        eventService.notify(Events.updateField);
        if (notify) {
          eventService.notify(Events.countermarchToolDeactivated);
        }
      }

      function save() {
        drillEditorService.countermarch({
          countermarchDirection: ctrl.countermarchDirection,
          fileDelay: ctrl.fileDelay,
          fileDelayDirection: ctrl.fileDelayDirection,
          rankDelay: ctrl.rankDelay,
        });

        deactivate();
      }
    },
  });


