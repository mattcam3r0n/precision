'use strict'

import WalkThru from '/client/lib/walkThru/WalkThru';
import DrillBuilder from '/client/lib/drill/DrillBuilder';
import { Meteor } from 'meteor/meteor';

angular.module('drillApp')
  .controller('DesignCtrl', function ($scope, $rootScope, $window, $reactive, appStateService) {
    $reactive(this).attach($scope);
    $scope.viewName = 'Design';
    $scope.isHelpVisible = false;
    $scope.currentPosition = "";

    $scope.drillId = null;
    $scope.drill = appStateService.currentDrill;

    $scope.subscribe('drills');

    $scope.helpers({
      numberOfDrills: function() {
        return Counts.get('numberOfDrills');
      },
      currentCount: function () {
        return 0;
      }
    });
    
    // update position indicator
    $rootScope.$on('positionIndicator', (evt, args) => {
      $scope.currentPosition = args.position;
      $scope.$safeApply();
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

    $scope.open = function() {
      triggerDrillChanged();
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
      triggerDrillChanged();
    });

    $scope.$on("$destroy", function(){
      // clean up?
      console.log($scope.drill);
    });

    function triggerDrillChanged() {
      $rootScope.$broadcast('drillChanged');      
    }

  });