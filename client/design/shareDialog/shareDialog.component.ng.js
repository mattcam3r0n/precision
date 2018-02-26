'use strict';

import Events from '/client/lib/Events';

angular.module('drillApp')
  .component('shareDialog', {
    templateUrl: 'client/design/shareDialog/shareDialog.view.ng.html',
    bindings: {
    },
    controller: function($scope, $rootScope, $timeout, appStateService,
        eventService, confirmationDialogService) {
      let ctrl = this;

      ctrl.$onInit = function() {
        ctrl.subscriptions = eventService.createSubscriptionManager();

        ctrl.subscriptions.subscribe(Events.showShareDialog,
          ctrl.activate.bind(this));
      };

      ctrl.$onDestroy = function() {
        ctrl.subscriptions.unsubscribeAll();
      };

      ctrl.activate = function() {
        $('#shareDialog').modal('show');
        getSharedUsers().then((users) => {
          ctrl.selectedUsers = users;
          $rootScope.$safeApply();
          // make sure list is scrolled to top. have to wait a bit
          // for dom to reflect changes;
          $timeout(() => {
            $('.share-dialog .user-list ul').scrollTop(0);
          }, 1000);
        });
      };

      ctrl.onSelected = function(user, selected) {
        ctrl.selectedUsers = selected;
        console.log(ctrl.selectedUsers);
      };

      ctrl.share = function() {
        appStateService.drill.sharedWith = ctrl.selectedUsers.map((u) => u._id);
        appStateService.saveDrill();
      };

      function getSharedUsers() {
        return Meteor.callPromise('getSharedUsers', appStateService.drill._id).then((users) => {
          console.log('sharedUsers', users);
          return users;
        });
      }
    },
  });


