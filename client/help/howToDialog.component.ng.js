'use strict';

import Events from '/client/lib/Events';

angular.module('drillApp')
  .component('howToDialog', {
    templateUrl: 'client/help/howToDialog.view.ng.html',
    bindings: {
    },
    controller: function($scope, $rootScope, $timeout, appStateService,
      eventService, confirmationDialogService) {
      let ctrl = this;

      ctrl.$onInit = function() {
        ctrl.subscriptions = eventService.createSubscriptionManager();

        ctrl.subscriptions.subscribe(Events.showHowToDialog,
          ctrl.activate.bind(this));

        $('#howToDialog').on('hidden.bs.modal', onHidden);
      };

      ctrl.$onDestroy = function() {
        ctrl.subscriptions.unsubscribeAll();
        $('#howToDialog').off('hidden.bs.modal');
      };

      ctrl.activate = function() {
        $('#howToDialog').modal('show');
      };

      function onHidden() {
      }
    },
  });


