'use strict';

import DesignKeyboardHandler from './DesignKeyboardHandler';
import Audio from '/client/lib/audio/Audio';
import Spinner from '/client/components/spinner/spinner';
import Events from '/client/lib/Events';
import EventSubscriptionManager from '/client/lib/EventSubscriptionManager';

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
      $window.addEventListener('keydown', keydown);

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
          return;
        }

        openLastDrillOrNew().then(openDrill);
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
      $window.removeEventListener('keydown', keydown);
      ctrl.subscriptions.unsubscribeAll();
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

    function keydown(e) {
      keyboardHandler.handle(e);
      $scope.$safeApply();
    }

    $scope.debug = function() {
      console.log('drill', $scope.drill);
    };

    // used by openDrillDialog when a drill is chosen
    $scope.onOpen = function(drillId) {
      openDrill(drillId);
    };
  });
