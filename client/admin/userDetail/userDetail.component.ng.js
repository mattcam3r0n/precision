'use strict';

import Events from '/client/lib/Events';
import EventSubscriptionManager from '/client/lib/EventSubscriptionManager';

angular.module('drillApp')
  .component('userDetail', {
    templateUrl: 'client/admin/userDetail/userDetail.view.ng.html',
    bindings: {
    },
    controller: function($rootScope, $scope, eventService) {
      let ctrl = this;

      ctrl.$onInit = function() {
        ctrl.subscriptions = new EventSubscriptionManager(eventService);
        ctrl.subscriptions.subscribe(Events.userSelected, (evt, args) => {
          ctrl.user = args.user;
          Meteor.callPromise('getUserStats', ctrl.user._id).then((userStats)=>{
            ctrl.userStats = userStats;
            $rootScope.$safeApply();
          });
          console.log(ctrl.userStats);
        });
      };

      ctrl.$onDestroy = function() {
        ctrl.subscriptions.unsubscribeAll();
      };

      ctrl.$onChanges = function() {
        console.log(ctrl.user);
      };

      ctrl.getCreatedDate = function() {
        if (!ctrl.user) return;
        return moment(ctrl.user.createdAt).format('MMMM Do YYYY, h:mm:ss a');
      };

      ctrl.getEmail = function() {
        if (!ctrl.user) return;
        return ctrl.user.emails[0].address;
      };
    },
  });


