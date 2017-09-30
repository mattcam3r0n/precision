'use strict'

import WalkThru from '/client/lib/walkThru/WalkThru';

angular.module('drillApp')
  .controller('DesignCtrl', function ($scope, $rootScope, $window) {
    $scope.viewName = 'Design';

    $scope.isHelpVisible = false;

    $scope.showHelp = function(){
      $scope.isHelpVisible = !$scope.isHelpVisible;

      var c = angular.element('#design-surface-col')
      c.removeClass($scope.isHelpVisible ? 'col-md-12' : 'col-md-11');
      c.addClass($scope.isHelpVisible ? 'col-md-11' : 'col-md-12');
      $rootScope.$broadcast('designSurface:resize');      
    }


    $scope.showIntro = function() {
      $scope.addMembers();
      var wt = new WalkThru();
      wt.start('addMembers');
    }

    // TEMP: need to get this from app state
    var drill = {
      name: "test2",
      members: [
        // {
        //   initialState: {
        //     x: 60,
        //     y: 60,
        //     direction: 0
        //   }
        // },
        // {
        //   initialState: {
        //     x: 60,
        //     y: 80,
        //     direction: 90
        //   }
        // },
        // {
        //   initialState: {
        //     x: 60,
        //     y: 100,
        //     direction: 180
        //   }
        // },
        // {
        //   initialState: {
        //     x: 60,
        //     y: 120,
        //     direction: 270
        //   }
        // }
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
      // var newMembers = [{
      //   initialState: {
      //     x: 60,
      //     y: drill.members[drill.members.length - 1].initialState.y + 20,
      //     direction: 90
      //   }
      // }];
      // drill.members.push(...newMembers);
      // $rootScope.$broadcast('memberAdded', { newMembers });
      $rootScope.$broadcast('activateAddMemberTool');
    };

    $scope.drawPath = function() {
      $window.alert('Not implemented yet!');
    };

    $scope.$on("$destroy", function(){
      //$interval.cancel(myInterval);
      console.log('$destroy design view');
    });

  });