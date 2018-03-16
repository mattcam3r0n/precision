'use strict'

angular.module('drillApp')
.config(function($stateProvider) {
  $stateProvider
  .state('help', {
    url: '/key-info',
    templateUrl: 'client/help/help.view.ng.html',
    controller: 'HelpCtrl'
  });
});