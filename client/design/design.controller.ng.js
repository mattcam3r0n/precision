'use strict'

import WalkThru from '/client/lib/walkThru/WalkThru';
import DesignKeyboardHandler from './DesignKeyboardHandler';
import Audio from '/client/lib/audio/Audio';
import Spinner from '/client/components/spinner/spinner';

import { Meteor } from 'meteor/meteor';

angular.module('drillApp')
  .controller('DesignCtrl', function ($scope, $window, appStateService, drillEditorService, eventService) {

    var ctrl = this;
    $scope.viewName = 'Design';

    var keyboardHandler;

    init();

    function init() {
      console.log('design init');
      ctrl.spinner = new Spinner($('div.design')[0]);

      $scope.tempo = 120;
      $window.addEventListener('keydown', keydown);

      Audio.init();

      if ($scope.currentUser) {
        appStateService.openLastDrillOrNew().then(openDrill);        
      }

      $scope.$watch('tempo', function () {
        drillEditorService.setTempo($scope.tempo);
      });

      $scope.$watch('currentUser', function (newValue, oldValue) {
        if ($scope.currentUser === undefined) return; // user not available yet

        if (newValue && oldValue && newValue._id === oldValue._id) return; // phantom change

        if ($scope.currentUser === null) { // signed out
          newDrill();
          return;
        }
        appStateService.openLastDrillOrNew().then(openDrill);
      });

      // handle selection event
      ctrl.unsubscribeObjectsSelected = eventService.subscribeObjectsSelected((evt, args) => {
        drillEditorService.selectMembers(args.members);
      });

      // update position indicator
      ctrl.unsubscribePositionIndicator = eventService.subscribePositionIndicator((event, args) => {
        $scope.currentPosition = args.position;
        $scope.$safeApply();
      });

      ctrl.unsubscribeShowSpinner = eventService.subscribeShowSpinner((event, args) => {
        ctrl.spinner.start();
      });

      ctrl.unsubscribeHideSpinner = eventService.subscribeHideSpinner((event, args) => {
        ctrl.spinner.stop();
      });
    }


    $scope.$on("$destroy", function () {
      $window.removeEventListener('keydown', keydown);
      ctrl.unsubscribeObjectsSelected();
      ctrl.unsubscribePositionIndicator();
      ctrl.unsubscribeShowSpinner();
      ctrl.unsubscribeHideSpinner();
    });

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
      drillEditorService.setTempo($scope.tempo);
      keyboardHandler = new DesignKeyboardHandler(drillEditorService, eventService);
      $scope.$safeApply(); // necessary for field painting?
    }

    function keydown(e) {
      keyboardHandler.handle(e);
      $scope.$safeApply();
    }

    $scope.debug = function () {
      console.log('drill', $scope.drill);
    }

    $scope.onNew = function () {
      newDrill();
    }

    $scope.onOpen = function (drillId) {
      openDrill(drillId);
    };

    $scope.onPlay = function () {
      drillEditorService.play(() => {
        $scope.$safeApply();
      });
    }

    $scope.onStop = function () {
      drillEditorService.stop();
      Audio.stop();
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

    $scope.onShowTimeline = function () {
      eventService.notifyShowTimeline();
    }

    // show help
    // TODO: Make this an overlay rather than resizing field
    $scope.showHelp = function () {
      $scope.isHelpVisible = !$scope.isHelpVisible;

      var c = angular.element('#design-surface-col')
      c.removeClass($scope.isHelpVisible ? 'col-md-12' : 'col-md-11');
      c.addClass($scope.isHelpVisible ? 'col-md-11' : 'col-md-12');
      eventService.notifyResize();
    }

    // show the "add members" walkthrough. make sure addMembers tool is displayed first.
    $scope.showIntro = function () {
      $scope.addMembers();
      var wt = new WalkThru();
      wt.start('addMembers');
    }

  });