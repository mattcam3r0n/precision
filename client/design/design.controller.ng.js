'use strict'

angular.module('drillApp')
.controller('DesignCtrl', function($scope, $rootScope) {
  $scope.viewName = 'Design';

  var drill = {
    name: "test2",
    members: []
  };

  $scope.helpers({
    currentCount: function() {
      return 0;
    },
    drill: function() {
      return drill;
    }
  });

  $scope.test = function() {
    drill.name += "*";
    drill.members.push({});
    $rootScope.$broadcast('memberAdded', { newMember: {} });
  };

  
});