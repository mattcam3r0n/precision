'use strict'

import WalkThru from '/client/lib/walkThru/WalkThru';
import DesignKeyboardHandler from './DesignKeyboardHandler';

import { Meteor } from 'meteor/meteor';

angular.module('drillApp')
  .controller('DesignCtrl', function ($scope, $rootScope, $timeout, $window, $reactive, appStateService, drillEditorService) {

    var ctrl = this;
    $reactive(ctrl).attach($scope);
    $scope.viewName = 'Design';

    var keyboardHandler;

    init();

    function init() {
      $scope.tempo = 120;
      $window.addEventListener('keydown', keydown);
      
      $scope.$watch('tempo', function () {
        drillEditorService.setTempo($scope.tempo);
      });

      $scope.$watch('currentUser', function(newValue, oldValue) {
        if ($scope.currentUser === undefined) return; // user not available yet

        if ($scope.currentUser === null) { // signed out
          newDrill();
          return;
        }

        appStateService.openLastDrillOrNew().then(openDrill);
      });

    }

    function newDrill() {
      var d = appStateService.newDrill();
      setDrill(d);
    }

    function openDrill(drill) {
      if (!drill) {
        newDrill();
        return;
      }

      appStateService.openDrill(drill._id).then(openedDrill => {
        setDrill(openedDrill);
      });
    }

    function setDrill(drill) {
      $scope.drill = drill;
      drillEditorService.setDrill(drill);
      keyboardHandler = new DesignKeyboardHandler(drillEditorService);
      $scope.$safeApply(); // necessary for field painting?
    }

    function keydown(e) {
      keyboardHandler.handle(e);
    }

    $scope.debug = function () {
      console.log('drill', $scope.drill);
    }

    $scope.onNew = function() {
      newDrill();
    }

    $scope.onOpen = function (drillId) {
      openDrill(drillId);
    };

    $scope.onPlay = function () {
      drillEditorService.play();
    }

    $scope.onStop = function () {
      drillEditorService.stop();
    }

    $scope.onGoToBeginning = function () {
      drillEditorService.goToBeginning();
    }

    $scope.onGoToEnd = function () {
      drillEditorService.goToEnd();
    }

    $scope.onStepBackward = function () {
      drillEditorService.stepBackward();
    }

    $scope.onStepForward = function () {
      drillEditorService.stepForward();
    }

    // handle selection event
    $scope.$on('field:objectsSelected', (evt, args) => {
      drillEditorService.selectMembers(args.members);
    });

    // update position indicator
    $rootScope.$on('positionIndicator', (evt, args) => {
      $scope.currentPosition = args.position;
      $scope.$safeApply();
    });

    $scope.$on("$destroy", function () {
      $window.removeEventListener('keydown', keydown);
      // clean up?
    });

    // show help
    // TODO: Make this an overlay rather than resizing field
    $scope.showHelp = function () {
      $scope.isHelpVisible = !$scope.isHelpVisible;

      var c = angular.element('#design-surface-col')
      c.removeClass($scope.isHelpVisible ? 'col-md-12' : 'col-md-11');
      c.addClass($scope.isHelpVisible ? 'col-md-11' : 'col-md-12');
      $rootScope.$broadcast('designSurface:resize');
    }

    // show the "add members" walkthrough. make sure addMembers tool is displayed first.
    $scope.showIntro = function () {
      $scope.addMembers();
      var wt = new WalkThru();
      wt.start('addMembers');
    }

  });