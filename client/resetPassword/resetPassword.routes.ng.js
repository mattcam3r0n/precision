'use strict';

angular.module('drillApp')
.config(function($stateProvider) {
  $stateProvider
  .state('reset-password', {
    url: '/reset-password',
    templateUrl: 'client/resetPassword/resetPassword.view.ng.html',
    controller: 'ResetPasswordCtrl',
  });
});
