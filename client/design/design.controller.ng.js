'use strict'

angular.module('drillApp')
.controller('DesignCtrl', function($scope) {
  $scope.viewName = 'Design';

  $scope.helpers({
    currentCount: function() {
      return 0;
    }
  });
  
});