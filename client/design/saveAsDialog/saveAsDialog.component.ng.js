'use strict';

import Events from '/client/lib/Events';
import EventSubscriptionManager from '/client/lib/EventSubscriptionManager';

angular.module('drillApp')
  .component('saveAsDialog', {
    templateUrl: 'client/design/saveAsDialog/saveAsDialog.view.ng.html',
    bindings: {
      drill: '<',
    },
    controller: function($scope, $rootScope, eventService, appStateService) {
      let ctrl = this;

      ctrl.activate = function(args) {
        ctrl.name = appStateService.drill.name;
        ctrl.description = appStateService.drill.description;
        $('#saveAsDialog').modal('show');
      };

      ctrl.isValid = function() {
        return true;
      };

      ctrl.saveAs = function() {
        appStateService.saveDrillAs({
          name: ctrl.name,
          description: ctrl.description,
        });
      };

      ctrl.$onInit = function() {
        ctrl.subscriptions = new EventSubscriptionManager(eventService);

        ctrl.subscriptions.subscribe(Events.showSaveAsDialog,
          ctrl.activate.bind(this));
      };

      ctrl.$onDestroy = function() {
        ctrl.subscriptions.unsubscribeAll();
      };
    },
  });


