'use strict'

angular.module('drillApp')
  .controller('DesignCtrl', function ($scope, $rootScope) {
    $scope.viewName = 'Design';

    // TEMP: need to get this from app state
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
      currentCount: function () {
        return 0;
      },
      drill: function () {
        return drill;
      }
    });

    $scope.addMembers = function () {
      // TEMP
      var newMembers = [{
        initialState: {
          x: 60,
          y: drill.members[drill.members.length - 1].initialState.y + 20,
          direction: 90
        }
      }];
      drill.members.push(...newMembers);
      $rootScope.$broadcast('memberAdded', { newMembers });
    };


  });