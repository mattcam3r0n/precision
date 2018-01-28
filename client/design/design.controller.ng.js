'use strict';

import DesignKeyboardHandler from './DesignKeyboardHandler';
import Audio from '/client/lib/audio/Audio';
import Spinner from '/client/components/spinner/spinner';
import Events from '/client/lib/Events';
import EventSubscriptionManager from '/client/lib/EventSubscriptionManager';

import Logger from '/client/lib/Logger';

angular.module('drillApp')
  .controller('DesignCtrl', function($scope,
                                      $window,
                                      appStateService,
                                      drillEditorService,
                                      eventService) {
    // eslint-disable-next-line
    let ctrl = this;
    $scope.viewName = 'Design';

    let keyboardHandler;

    init();

    function init() {
      ctrl.spinner = new Spinner($('div.design')[0]);
      ctrl.subscriptions = new EventSubscriptionManager(eventService);

      $scope.tempo = 120;
      $window.addEventListener('keydown', onKeydown);
      $window.addEventListener('error', onError);

      Audio.init();

      if ($scope.currentUser) {
        openLastDrillOrNew().then(openDrill);
      }

      $scope.$watch('tempo', function() {
        drillEditorService.setTempo($scope.tempo);
      });

      $scope.$watch('currentUser', function(newValue, oldValue) {
        if ($scope.currentUser === undefined) return; // user not available yet

        if (newValue && oldValue && newValue._id === oldValue._id) return; // phantom change

        appStateService.userChanged();

        if ($scope.currentUser === null) { // signed out
          newDrill();
          Logger.info('User ' + (oldValue ? oldValue._id : '') + ' logged out.');
          return;
        }

        openLastDrillOrNew().then(openDrill);
        Logger.info('User ' + newValue._id + ' logged in.');
      });

      // handle events
      ctrl.subscriptions.subscribe(Events.newDrill, (evt, args) => {
        newDrill();
      });

      ctrl.subscriptions.subscribe(Events.showOpenDrillDialog, (evt, args) => {
        $('#openDrillDialog').modal('show');
      });

      ctrl.subscriptions
        .subscribe(Events.showDrillPropertiesDialog, (evt, args) => {
        });

      ctrl.subscriptions
        .subscribe(Events.objectsSelected, (evt, args) => {
          drillEditorService.selectMembers(args.members);
        });

      ctrl.subscriptions.subscribe(Events.showSpinner, (event, args) => {
        ctrl.spinner.start();
      });

      ctrl.subscriptions.subscribe(Events.hideSpinner, (event, args) => {
        ctrl.spinner.stop();
      });
    }


    $scope.$on('$destroy', function() {
      ctrl.subscriptions.unsubscribeAll();
      $window.removeEventListener('keydown', onKeydown);
      $window.removeEventListener('error', onError);
    });

    function openLastDrillOrNew() {
      return appStateService.getLastDrillId()
          .then((drillId) => {
              if (!drillId) {
                return appStateService.newDrill();
              }

              return appStateService.openDrill(drillId);
          });
    }

    function newDrill() {
      let d = appStateService.newDrill();
      setDrill(d);
      drillEditorService.goToBeginning();
    }

    function openDrill(drill) {
      if (!drill) {
        newDrill();
        return;
      }

      setDrill(drill);
      drillEditorService.goToBeginning();
    }

    function setDrill(drill) {
      $scope.drill = drill;
      appStateService.drill = drill;
      drillEditorService.setDrill(drill);
      drillEditorService.setTempo($scope.tempo);
      // eslint-disable-next-line max-len
      keyboardHandler = new DesignKeyboardHandler(drillEditorService, eventService);
      $scope.$safeApply(); // necessary for field painting?
    }

    function getDrillId() {
      if (!$scope.drill) return null;
      if (!$scope.drill._id) return 'new';
      return $scope.drill._id;
    }

    function onKeydown(e) {
      keyboardHandler.handle(e);
      $scope.$safeApply();
    }

    function onError(e) {
      Logger.info('Uncaught error', {
        message: e.message,
        lineno: e.lineno,
        colno: e.colno,
        stack: e.error.stack,
        isTrusted: e.isTrusted,
        filename: e.filename,
        drillId: getDrillId(),
      });
    }

    $scope.debug = function() {
      console.log('drill', $scope.drill);
    };

    // used by openDrillDialog when a drill is chosen
    $scope.onOpen = function(drillId) {
      openDrill(drillId);
    };
  });
