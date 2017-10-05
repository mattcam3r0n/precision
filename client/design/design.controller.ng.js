'use strict'

import WalkThru from '/client/lib/walkThru/WalkThru';
import DrillBuilder from '/client/lib/drill/DrillBuilder';
import { Meteor } from 'meteor/meteor';

angular.module('drillApp')
  .controller('DesignCtrl', function ($scope, $rootScope, $window, $reactive, appStateService) {

    $scope.viewName = 'Design';
    $scope.isHelpVisible = false;
    $scope.currentPosition = "";
    $scope.drill = appStateService.currentDrill;

    // TODO: do i need this? seems to interfere with subscription in open dialog
    //$scope.subscribe('drills');

    $scope.helpers({
      numberOfDrills: function() {
        return Counts.get('numberOfDrills');
      },
      currentCount: function () {
        return 0;
      }
    });

    $scope.onOpen = function(drill) {
      $scope.drill = appStateService.currentDrill = drill;
      triggerDrillChanged();
    };

    $window.addEventListener('keydown', keydown);  

    function keydown(e) {
      //console.log('design window', e.target, e);
      // prevent default when BODY is source, to 
      // prevent movement of body/document in browser
      // when arrow keys are pressed
      // TODO: limit to body + arrow keys?
      if(e.target.tagName == 'BODY')      
        e.preventDefault();
    }

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
      $window.removeEventListener('keydown', keydown);
      // clean up?
      console.log($scope.drill);
    });

    function triggerDrillChanged() {
      $rootScope.$broadcast('drillChanged');      
    }

  });