'use strict'

import WalkThru from '/client/lib/walkThru/WalkThru';
import DrillBuilder from '/client/lib/drill/DrillBuilder';

angular.module('drillApp')
  .controller('DesignCtrl', function ($scope, $rootScope, $window, appStateService) {
    $scope.viewName = 'Design';
    $scope.isHelpVisible = false;
    $scope.currentPosition = "On the 50";
    $scope.drill = appStateService.currentDrill;

    // update position indicator
    $rootScope.$on('positionIndicator', (evt, args) => {
      $scope.currentPosition = args.position;
      $scope.$apply();
    });

    // show help
    // TODO: Make this an overlay rather than resizing field
    $scope.showHelp = function(){
      $scope.isHelpVisible = !$scope.isHelpVisible;

      var c = angular.element('#design-surface-col')
      c.removeClass($scope.isHelpVisible ? 'col-md-12' : 'col-md-11');
      c.addClass($scope.isHelpVisible ? 'col-md-11' : 'col-md-12');
      $rootScope.$broadcast('designSurface:resize');      
    }

    // show the "add members" walkthrough. make sure addMembers tool is displayed first.
    $scope.showIntro = function() {
      $scope.addMembers();
      var wt = new WalkThru();
      wt.start('addMembers');
    }

    $scope.helpers({
      currentCount: function () {
        return 0;
      }
    });

    $scope.open = function() {
      $rootScope.$broadcast('drillChanged');
    };

    $scope.addMembers = function () {
      $rootScope.$broadcast('activateAddMemberTool');
    };

    $scope.drawPath = function() {
      $window.alert('Not implemented yet!');
    };

    $scope.$on('membersAdded', function(e, args){
      var builder = new DrillBuilder($scope.drill);
      builder.addMembers(args.members);
      appStateService.saveDrill();
      $rootScope.$broadcast('drillChanged');
    });

    $scope.$on("$destroy", function(){
      // clean up?
      console.log($scope.drill);
    });

  });