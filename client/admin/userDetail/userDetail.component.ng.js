'use strict';

import Events from '/client/lib/Events';

angular.module('drillApp')
  .component('userDetail', {
    templateUrl: 'client/admin/userDetail/userDetail.view.ng.html',
    bindings: {
    },
    controller: function($rootScope, $scope,
      eventService, confirmationDialogService) {
      let ctrl = this;

      ctrl.$onInit = function() {
        ctrl.subscriptions = eventService.createSubscriptionManager();
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
          enableAccount();
        } else {
          disableAccount();
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
          removeAdmin();
        } else {
          makeAdmin();
        }
      };

      function disableAccount() {
        confirmationDialogService.show({
          heading: 'Disable Account',
          message: 'Are you sure you want to disable '
            + ctrl.user.emails[0].address + '?',
          confirmText: 'Disable',
        }).then((result) => {
          if (result.confirmed) {
            Meteor.callPromise('disableUserAccount', ctrl.user._id).then(() => {
              $rootScope.$safeApply();
            });
          }
        });
      }

      function enableAccount() {
        confirmationDialogService.show({
          heading: 'Enable Account',
          message: 'Are you sure you want to enable '
            + ctrl.user.emails[0].address + '?',
          confirmText: 'Enable',
        }).then((result) => {
          if (result.confirmed) {
            Meteor.callPromise('enableUserAccount', ctrl.user._id).then(() => {
              $rootScope.$safeApply();
            });
          }
        });
      }

      function makeAdmin() {
        confirmationDialogService.show({
          heading: 'Make Admin',
          message: 'Are you sure you want to make '
            + ctrl.user.emails[0].address + ' an administrator?',
          confirmText: 'Ok',
        }).then((result) => {
          if (result.confirmed) {
            Meteor.callPromise('addAdminRole', ctrl.user._id).then(() => {
              $rootScope.$safeApply();
            });
          }
        });
      }

      function removeAdmin() {
        confirmationDialogService.show({
          heading: 'Remove Admin',
          message: 'Are you sure you want to remove administrator priveleges for '
            + ctrl.user.emails[0].address + '?',
          confirmText: 'Remove',
        }).then((result) => {
          if (result.confirmed) {
            Meteor.callPromise('removeAdminRole', ctrl.user._id).then(() => {
              $rootScope.$safeApply();
            });
          }
        });
      }
    },
  });


