'use strict';

angular.module('drillApp')
.config(function($stateProvider) {
  $stateProvider
  .state('admin', {
    url: '/admin',
    templateUrl: 'client/admin/admin.view.ng.html',
    controller: 'AdminCtrl',
  });
});
