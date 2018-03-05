'use strict';

import Events from '/client/lib/Events';

angular.module('drillApp')
  .component('drillPropertiesDialog', {
    templateUrl: 'client/design/drillPropertiesDialog/drillPropertiesDialog.view.ng.html',
    bindings: {
      drill: '<',
    },
    controller: function($scope, $rootScope, eventService, appStateService) {
      let ctrl = this;

      ctrl.$onInit = function() {
        ctrl.subscriptions = eventService.createSubscriptionManager();

        ctrl.subscriptions.subscribe(Events.showDrillPropertiesDialog, () => {
          ctrl.activate('drillProperties');
        });

        ctrl.subscriptions.subscribe(Events.showNewDrillDialog, () => {
          ctrl.activate('newDrill');
        });

        // FOR NOW, leave switch disabled
        $('[name=\'stride-type-switch\']').bootstrapSwitch('disabled', true);
      };

      ctrl.$onDestroy = function() {
        ctrl.subscriptions.unsubscribeAll();
      };

      ctrl.activate = function(mode) {
        ctrl.title = mode == 'newDrill' ? 'New Drill' : 'Drill Properties';
        ctrl.name = appStateService.drill.name;
        ctrl.description = appStateService.drill.description;
        $('#drillPropertiesDialog').modal('show');
      };

      ctrl.isValid = function() {
        return true;
      };

      ctrl.save = function() {
        appStateService.drill.name = ctrl.name;
        appStateService.drill.description = ctrl.description;
        eventService.notify(Events.drillPropertiesChanged, {
          name: ctrl.name,
          description: ctrl.description,
        });
        appStateService.saveDrill();
      };
    },
  });


