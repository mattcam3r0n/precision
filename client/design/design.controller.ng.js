'use strict'

import WalkThru from '/client/lib/walkThru/WalkThru';
import DrillBuilder from '/client/lib/drill/DrillBuilder';
import DrillPlayer from '/client/lib/drill/DrillPlayer';
import DesignKeyboardHandler from './DesignKeyboardHandler';

import { Meteor } from 'meteor/meteor';

angular.module('drillApp')
  .controller('DesignCtrl', function ($scope, $rootScope, $timeout, $window, $reactive, appStateService) {

    var ctrl = this;
    $reactive(ctrl).attach($scope);
    $scope.viewName = 'Design';


    var drillBuilder,
      drillPlayer,
      keyboardHandler,
      saveTimeout;

    init();

    function init() {
      $scope.tempo = 120;
      $window.addEventListener('keydown', keydown);

      $scope.$watch('tempo', function () {
        if (drillPlayer)
          drillPlayer.setTempo($scope.tempo);
      });

      $scope.$watch('currentUser', function(newValue, oldValue) {
        if ($scope.currentUser === undefined) return;
        appStateService.openLastDrillOrNew()
        .then(openDrill);
      });

      // appStateService.testInsertDrill();
      // appStateService.getDrill('jS3yAf6qLAhXWr4sf').then((d) => {
      //   console.log(d);
      // });
    }

    function openDrill(drill) {
      $scope.drill = drill;
      drillBuilder = new DrillBuilder(drill);
      drillPlayer = new DrillPlayer(drill);
      keyboardHandler = new DesignKeyboardHandler(drillBuilder, drillPlayer);
      drillPlayer.goToBeginning();
      drillBuilder.deselectAll();
      triggerDrillStateChanged(); // to force repaint
    }

    function keydown(e) {
      keyboardHandler.handle(e);
      triggerDrillStateChanged();
      save();
    }

    function triggerDrillStateChanged(args) {
      $scope.$broadcast('design:drillStateChanged', args);
      $scope.$safeApply();
    }

    function save() {
      if (!$scope.drill.isDirty) return;

      if (saveTimeout) {
        $timeout.cancel(saveTimeout)
      }

      saveTimeout = $timeout(() => appStateService.saveDrill(), 5000);
    }

    $scope.debug = function () {
      console.log('drill', $scope.drill);
    }

    $scope.onOpen = function (drillId) {
      openDrill(drillId);
    };

    $scope.onPlay = function () {
      drillPlayer.play(triggerDrillStateChanged);
    }

    $scope.onStop = function () {
      drillPlayer.stop();
    }

    $scope.onGoToBeginning = function () {
      drillPlayer.goToBeginning();
      triggerDrillStateChanged();
    }

    $scope.onGoToEnd = function () {
      drillPlayer.goToEnd();
      triggerDrillStateChanged();
    }

    $scope.onStepBackward = function () {
      drillPlayer.stepBackward();
      triggerDrillStateChanged();
    }

    $scope.onStepForward = function () {
      drillPlayer.stepForward();
      triggerDrillStateChanged();
    }

    // handle selection event
    $scope.$on('membersSelected', (evt, args) => {
      drillBuilder.select(args.members);

      triggerDrillStateChanged({
        selectedMembers: args.members,
        selectedFiles: drillBuilder.getSelectedFiles(),
        selectedRanks: []
      });

      $rootScope.$broadcast('design:activateAddStepsTool');
      // drillBuilder.getSelectedFiles().forEach(f => {
      //   console.log(f);
      //   console.log(f.getLinePoints());
      // });
//      console.log(drillBuilder.getSelectedFiles());
    });

    $scope.$on('designTool:deselectAll', (evt, args) => {
      drillBuilder.deselectAll();
      triggerDrillStateChanged();
    });

    $scope.$on('designTool:selectAll', (evt, args) => {
      drillBuilder.selectAll();
      triggerDrillStateChanged();
    });

    // update position indicator
    $rootScope.$on('positionIndicator', (evt, args) => {

      // console.log(args);
      //drillBuilder.selection


      $scope.currentPosition = args.position;
      $scope.$safeApply();
    });

    $scope.$on('addMembersTool:membersAdded', function (e, args) {
      drillBuilder.addMembers(args.members);
      $scope.$broadcast('design:membersAdded', args);
      save();
      triggerDrillStateChanged();
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