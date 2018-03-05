'use strict';

import Events from '/client/lib/Events';

angular.module('drillApp')
  .component('keyboardShortcuts', {
    templateUrl: 'client/design/keyboardShortcuts/keyboardShortcuts.component.ng.html',
    bindings: {
    },
    controller: function($scope, eventService) {
      let ctrl = this;

      ctrl.$onInit = function() {
        ctrl.isActivated = false;
        ctrl.subscriptions = eventService.createSubscriptionManager();

        ctrl.subscriptions.subscribe(Events.showKeyboardShortcuts, () => {
            console.log('show keyboard shortcuts');
            activate();
        });
      };

      ctrl.$onDestroy = function() {
      };

      ctrl.commandKey = function() {
        // TODO: determine appropriate symbol for windows/mac
        return isMac() ? '⌘' : '^';
      };

      function isMac() {
        return (navigator.appVersion.indexOf('Mac') != -1);
      }

      $scope.activate = activate;

      $scope.deactivate = function() {
      };

      $scope.cancel = deactivate;

      function activate() {
        if (ctrl.isActivated) {
          deactivate();
        }

        ctrl.isActivated = true;
      }

      function deactivate() {
        ctrl.isActivated = false;
      }
    },
  });


