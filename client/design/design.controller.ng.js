'use strict'

angular.module('drillApp')
.controller('DesignCtrl', function($scope, $rootScope) {
  $scope.viewName = 'Design';

  var drill = {
    name: "test2",
    members: [
      {
        initialState: {
          x: 60,
          y: 60,
          direction: 90
        }
      },
      {
        initialState: {
          x: 60,
          y: 80,
          direction: 90
        }
      }
    ]
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