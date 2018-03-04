'use strict';

angular.module('drillApp')
.config(function($stateProvider) {
  $stateProvider
  .state('change-password', {
    url: '/change-password',
    templateUrl: 'client/changePassword/changePassword.view.ng.html',
    controller: 'ChangePasswordCtrl',
  });
});
