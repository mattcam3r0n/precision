'use strict';

import Events from '/client/lib/Events';
import EventSubscriptionManager from '/client/lib/EventSubscriptionManager';

angular.module('drillApp')
  .component('userDetail', {
    templateUrl: 'client/admin/userDetail/userDetail.view.ng.html',
    bindings: {
    },
    controller: function($rootScope, $scope,
      eventService, confirmationDialogService) {
      let ctrl = this;

      ctrl.$onInit = function() {
        ctrl.subscriptions = new EventSubscriptionManager(eventService);
        ctrl.subscriptions.subscribe(Events.userSelected, (evt, args) => {
          ctrl.user = args.user;
          Meteor.callPromise('getUserStats', ctrl.user._id).then((userStats) => {
            ctrl.userStats = userStats;
            $rootScope.$safeApply();
          });
        });
      };

      ctrl.$onDestroy = function() {
        ctrl.subscriptions.unsubscribeAll();
      };

      ctrl.$onChanges = function() {
        console.log(ctrl.user);
      };

      ctrl.getEmail = function() {
        if (!ctrl.user) return;
        return ctrl.user.emails[0].address;
      };

      ctrl.isAdmin = function() {
        if (!ctrl.user) return false;
        return Roles.userIsInRole(ctrl.user._id, 'admin');
      };

      ctrl.isDisabled = function() {
        if (!ctrl.user) return false;
        return Roles.userIsInRole(ctrl.user._id, 'disabled');
      };

      ctrl.enableDisableAccount = function() {
        if (!ctrl.user) return;
        const isDisabled = Roles.userIsInRole(ctrl.user._id, 'disabled');
        if (isDisabled) {
          Meteor.call('enableUserAccount', ctrl.user._id);
        } else {
          Meteor.call('disableUserAccount', ctrl.user._id);
        }
      };

      ctrl.deleteAccount = function() {
        if (!ctrl.user) return;

        confirmationDialogService.show({
          heading: 'Delete User',
          message: 'Are you sure you want to delete user '
            + ctrl.user.emails[0].address + '?',
          confirmText: 'Delete',
        }).then((result) => {
          if (result.confirmed) {
            Meteor.call('deleteUser', ctrl.user._id);
            eventService.notify(Events.userSelected, {
              user: Meteor.user(),
            });
          }
        });
      };

      ctrl.addRemoveAdmin = function() {
        if (!ctrl.user) return;
        const isAdmin = Roles.userIsInRole(ctrl.user._id, 'admin');
        if (isAdmin) {
          Meteor.call('removeAdminRole', ctrl.user._id);
        } else {
          Meteor.call('addAdminRole', ctrl.user._id);
        }
      };
    },
  });


