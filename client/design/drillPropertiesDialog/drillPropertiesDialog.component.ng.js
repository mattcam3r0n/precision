'use strict';

import Events from '/client/lib/Events';
import EventSubscriptionManager from '/client/lib/EventSubscriptionManager';

angular.module('drillApp')
  .component('drillPropertiesDialog', {
    templateUrl: 'client/design/drillPropertiesDialog/drillPropertiesDialog.view.ng.html',
    bindings: {
      drill: "<"
    },
    controller: function ($scope, $rootScope, eventService, appStateService) {
      var ctrl = this;

      ctrl.activate = function (args) {
        ctrl.drill = appStateService.drill;
        $('#drillPropertiesDialog').modal('show');        
      }

      ctrl.isValid = function() {
        return true;
      }

      ctrl.$onInit = function () {
        ctrl.subscriptions = new EventSubscriptionManager(eventService);

        ctrl.subscriptions.subscribe(Events.showDrillPropertiesDialog, ctrl.activate.bind(this));
      }

      ctrl.$onDestroy = function () {
        ctrl.subscriptions.unsubscribeAll();
      }
    }
  });


