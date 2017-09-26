'use strict'

angular.module('drillApp')
.config(function($stateProvider) {
  $stateProvider
  .state('help', {
    url: '/help',
    templateUrl: 'client/help/help.view.ng.html',
    controller: 'HelpCtrl'
  });
});