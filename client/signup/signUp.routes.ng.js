'use strict';

angular.module('drillApp')
.config(function($stateProvider) {
  $stateProvider
  .state('sign-up', {
    url: '/sign-up',
    templateUrl: 'client/signup/signUp.view.ng.html',
    controller: 'LoginCtrl',
  });
});
