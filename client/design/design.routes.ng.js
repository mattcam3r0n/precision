'use strict'

angular.module('drillApp')
.config(function($stateProvider) {
  $stateProvider
  .state('design', {
    url: '/design',
    templateUrl: 'client/design/design.view.ng.html',
    controller: 'DesignCtrl',
    resolve: {
      currentUser: ['$meteor', function($meteor) {
        return $meteor.requireUser();
      }]
    }
  });
});