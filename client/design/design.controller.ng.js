'use strict'

import WalkThru from '/client/lib/walkThru/WalkThru';
import DrillBuilder from '/client/lib/drill/DrillBuilder';
import DrillPlayer from '/client/lib/drill/DrillPlayer';
import DesignKeyboardHandler from './DesignKeyboardHandler';
import MemberSelection from '/client/lib/drill/MemberSelection';

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
        if ($scope.currentUser === undefined) return; // user not available yet

        if ($scope.currentUser === null) { // signed out
          newDrill();
          return;
        }

        appStateService.openLastDrillOrNew()
        .then(openDrill);
      });

    }

    function newDrill() {
      var newDrill = appStateService.newDrill();
      setDrill(newDrill);
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
      drillBuilder = new DrillBuilder(drill);
      drillPlayer = new DrillPlayer(drill);
      drillPlayer.setTempo($scope.tempo || 120);
      keyboardHandler = new DesignKeyboardHandler(drillBuilder, drillPlayer, $rootScope);
      drillPlayer.goToBeginning();
      drillBuilder.deselectAll();
      drillBuilder.showAll();
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

    function triggerMembersSelected(args) {
      $rootScope.$broadcast('design:membersSelected', args);
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

    $scope.onNew = function() {
      newDrill();
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
    $scope.$on('field:objectsSelected', (evt, args) => {
      drillBuilder.select(args.members);
      triggerMembersSelected({
        memberSelection: drillBuilder.getMemberSelection()
      });
      triggerDrillStateChanged({
        memberSelection: drillBuilder.getMemberSelection()
      });
    });

    $scope.$on('designTool:activateAddTurnsTool', (evt, args) => {      
      $rootScope.$broadcast('design:activateAddTurnsTool', { memberSelection: drillBuilder.getMemberSelection() }); 
    });

    $scope.$on('designTool:deleteSelectedMembers', (evt, args) => {
      drillBuilder.deleteSelectedMembers();
      $scope.$broadcast('design:membersAdded', args);      
      triggerDrillStateChanged();
    });

    $scope.$on('designTool:selectAll', (evt, args) => {
      drillBuilder.selectAll();
      triggerDrillStateChanged();
    });

    $scope.$on('designTool:deselectAll', (evt, args) => {
      drillBuilder.deselectAll();
      triggerDrillStateChanged();
    });

    $scope.$on('designTool:hideUnselected', (evt, args) => {
      drillBuilder.hideUnselected();
      triggerDrillStateChanged();
    });

    $scope.$on('designTool:showAll', (evt, args) => {
      drillBuilder.showAll();
      triggerDrillStateChanged();
    });

    $scope.$on('designTool:deleteForward', (evt, args) => {
      drillBuilder.deleteForward();
      triggerDrillStateChanged();
    });

    $scope.$on('designTool:deleteBackspace', (evt, args) => {
      var deleteCount = $scope.drill.count;
      drillPlayer.stepBackward();
      drillBuilder.deleteBackspace(deleteCount);
      triggerDrillStateChanged();
    });

    $scope.$on('addTurnsTool:save', (evt, args) => {
      $scope.drill.isDirty = true;
      save();
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