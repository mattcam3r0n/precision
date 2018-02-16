'use strict';

angular.module('drillApp')
.config(function($stateProvider) {
  $stateProvider
  .state('admin', {
    url: '/admin',
    templateUrl: 'client/admin/admin.view.ng.html',
    controller: 'AdminCtrl',
    resolve: {
      currentUser: ['$meteor', function($meteor) {
        return $meteor.requireValidUser(function(user) {
          return Roles.userIsInRole(user._id, 'admin');
        });
      }],
    },
  });
});
