'use strict';

import Events from '/client/lib/Events';

angular.module('drillApp')
  .component('marcherColorsTool', {
    // eslint-disable-next-line max-len
    templateUrl: 'client/design/designSurface/marcherColorsTool/marcherColorsTool.view.ng.html',
    bindings: {
    },
    controller: function($scope,
                        $window,
                        appStateService,
                        drillEditorService,
                        eventService) {
      let ctrl = this;

      const instrumentColors = {
        flute: 'pink',
        clarinet: 'gainsboro',
        lowreed: 'indigo',
        saxophone: 'green',
        trumpet: 'blue',
        horn: 'gold',
        trombone: 'red',
        tuba: 'orange',
        percussion: 'gray',
      };

      ctrl.$onInit = function() {
        $('[data-toggle="tooltip"]').tooltip();

        ctrl.subscriptions = eventService.createSubscriptionManager();

        ctrl.subscriptions.subscribe(Events.activateMarcherColorsTool,
          (evt, args) => {
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

      $scope.setColor = function(instrument) {
        ctrl.memberSelection.members.forEach((member) => {
          member.color = instrumentColors[instrument];
        });
        eventService.notify(Events.membersChanged);
        drillEditorService.deselectAll();
        drillEditorService.save(true);
      };

      function activate(memberSelection) {
        if (ctrl.isActivated) {
          deactivate();
        }

        appStateService.setActiveTool('marcherColors', () => {
          deactivate(false);
        });

        ctrl.isActivated = true;
        ctrl.field = appStateService.field;
        ctrl.memberSelection = memberSelection;
        ctrl.field.disablePositionIndicator();
        // TODO: should we allow selection while this tool is active?
        ctrl.subscriptions.subscribe(Events.membersSelected, (evt, args) => {
          if (!ctrl.isActivated) return;
          ctrl.memberSelection = args.memberSelection;
        });
     }

      function deactivate(notify = true) {
        ctrl.subscriptions.unsubscribe(Events.membersSelected);
        ctrl.isActivated = false;
        ctrl.field.enablePositionIndicator();
        ctrl.field.canvas.selection = true;
        ctrl.field.canvas.defaultCursor = 'default';
        eventService.notify(Events.updateField);
        if (notify) {
          eventService.notify(Events.marcherColorsToolDeactivated);
        }
      }

      function save() {
        ctrl.memberSelection.members.forEach((member) => {
        });

        drillEditorService.save(true);
        deactivate();
      }
    },
  });


