'use strict'

import WalkThru from '/client/lib/walkThru/WalkThru';
import DrillBuilder from '/client/lib/drill/DrillBuilder';
import DrillPlayer from '/client/lib/drill/DrillPlayer';
import DesignKeyboardHandler from './DesignKeyboardHandler';

import { Meteor } from 'meteor/meteor';

angular.module('drillApp')
  .controller('DesignCtrl', function ($scope, $rootScope, $window, $reactive, appStateService) {

    $scope.viewName = 'Design';

    var drillBuilder,
        drillPlayer,
        keyboardHandler;

    init();

    function init() {
      openDrill(appStateService.currentDrill);  
      $window.addEventListener('keydown', keydown);  
    }

    // TODO: do i need this? seems to interfere with subscription in open dialog
    //$scope.subscribe('drills');

    $scope.helpers({
      currentCount: function () {
        return 0;
      }
    });

    function openDrill(drill) {
      $scope.drill = appStateService.currentDrill = drill;
      drillBuilder = new DrillBuilder(drill);
      drillPlayer = new DrillPlayer(drill);
      keyboardHandler = new DesignKeyboardHandler(drillBuilder, drillPlayer);
    }

    function keydown(e) {
      keyboardHandler.handle(e);
      triggerDrillStateChanged();
    }

    function triggerDrillStateChanged() {
      $scope.$broadcast('design:drillStateChanged');      
    }

    $scope.debug = function() {
      console.log('drill', $scope.drill);
    }

    $scope.onOpen = function(drill) {
      openDrill(drill);
    };
    
    // update position indicator
    $rootScope.$on('positionIndicator', (evt, args) => {
      $scope.currentPosition = args.position;
      $scope.$safeApply();
    });

    $scope.$on('addMembersTool:membersAdded', function(e, args){
      drillBuilder.addMembers(args.members);
      $scope.$broadcast('design:membersAdded', args);
      appStateService.saveDrill();
      triggerDrillStateChanged();
    });

    $scope.$on("$destroy", function(){
      $window.removeEventListener('keydown', keydown);
      // clean up?
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
    
  });