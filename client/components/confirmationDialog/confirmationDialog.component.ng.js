'use strict';

import Events from '/client/lib/Events';
import EventSubscriptionManager from '/client/lib/EventSubscriptionManager';

angular.module('drillApp')
  .component('confirmationDialog', {
    templateUrl: 'client/components/confirmationDialog/confirmationDialog.view.ng.html',
    bindings: {
    },
    controller: function($scope, appStateService, eventService) {
      let ctrl = this;

      ctrl.$onInit = function() {
        ctrl.subscriptions = new EventSubscriptionManager(eventService);
        ctrl.subscriptions
          .subscribe(Events.showConfirmationDialog, (evt, args) => {
            ctrl.heading = args.heading;
            ctrl.message = args.message;
            ctrl.confirmText = args.confirmText || 'Ok';
            ctrl.cancelText = args.cancelText || 'Cancel';
            ctrl.show();
          });
      };

      ctrl.$onDestroy = function() {
        ctrl.subscriptions.unsubscribeAll();
      };

      ctrl.show = function() {
        $('#confirmationDialog').modal('show');
      };

      ctrl.hide = function() {
        $('#confirmationDialog').modal('hide');
      };

      ctrl.ok = function() {
        ctrl.hide();
        eventService.notify(Events.confirmationDialogClosed, {
          confirmed: true,
          canceled: false,
        });
      };

      ctrl.cancel = function() {
        ctrl.hide();
        eventService.notify(Events.confirmationDialogClosed, {
          confirmed: false,
          canceled: true,
        });
      };
    },
  });


