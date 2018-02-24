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

      ctrl.activate = function(args) {
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

      ctrl.$onInit = function() {
        ctrl.subscriptions = eventService.createSubscriptionManager();

        ctrl.subscriptions.subscribe(Events.showDrillPropertiesDialog,
          ctrl.activate.bind(this));
      };

      ctrl.$onDestroy = function() {
        ctrl.subscriptions.unsubscribeAll();
      };
    },
  });


