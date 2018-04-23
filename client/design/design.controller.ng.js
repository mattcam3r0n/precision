'use strict';

import DesignKeyboardHandler from './DesignKeyboardHandler';
import Audio from '/client/lib/audio/Audio';
import Spinner from '/client/components/spinner/spinner';
import Events from '/client/lib/Events';

import Logger from '/client/lib/Logger';

angular.module('drillApp')
  .controller('DesignCtrl', function($scope,
                                      $window,
                                      $location,
                                      $timeout,
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
      ctrl.subscriptions = eventService.createSubscriptionManager();

      $scope.tempo = 120;
      $window.addEventListener('keydown', onKeydown);

      Audio.init();

      if ($scope.currentUser) {
        openLastDrillOrNew().then(openDrill);
      }

      $scope.$watch('tempo', function() {
        drillEditorService.setTempo($scope.tempo);
      });

      // console.log($scope.isLoggingIn);

      $scope.$watch('currentUser', function(newValue, oldValue) {
        // console.log($scope);
        // console.log($scope.isLoggingIn);

        // $scope.$awaitUser().then(() => {
        //   console.log('awaitUser', $scope.currentUser);
        // });

        if ($scope.currentUser === undefined) return; // user not available yet

        if (newValue && oldValue && newValue._id === oldValue._id) return; // phantom change

        appStateService.userChanged();

        if ($scope.currentUser === null) { // signed out
          Logger.info('User ' + (oldValue ? oldValue._id : '') + ' logged out.');
          $location.path('/login');
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

      ctrl.subscriptions.subscribe(Events.drillOpened, (evt, args) => {
        onDrillOpened(args.drill);
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

      // show intro dialog
      $timeout(() => {
        if (Meteor.user() && !Meteor.user().profile.dontShowIntro) {
          eventService.notify(Events.showIntroDialog);
          appStateService.dontShowIntro = true;
          appStateService.updateUserProfile();
        }
      }, 1500);
    }

    $scope.$on('$destroy', function() {
      ctrl.subscriptions.unsubscribeAll();
      $window.removeEventListener('keydown', onKeydown);
    });

    function openLastDrillOrNew() {
      return appStateService.getLastDrillId()
          .then((drillId) => {
              if (!drillId) {
                eventService.notify(Events.hideSpinner);
                return appStateService.newDrill();
              }

              return appStateService
                      .openDrill(drillId)
                      .then((drill) => {
                        eventService.notify(Events.hideSpinner);
                        return drill;
                      });
          });
    }

    function newDrill() {
      let d = appStateService.newDrill();
      setDrill(d);
      drillEditorService.goToBeginning();
      eventService.notify(Events.showNewDrillDialog);
    }

    function openDrill(drill) {
      if (!drill) {
        newDrill();
        return;
      }

// TEMP
// drill.bookmarks = [{ count: 0, name: 'The Beginning' }, { count: 12, name: 'Intro' }];

      setDrill(drill);
      drillEditorService.goToBeginning();
    }

    function onDrillOpened(drill) {
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

    // function getDrillId() {
    //   if (!$scope.drill) return null;
    //   if (!$scope.drill._id) return 'new';
    //   return $scope.drill._id;
    // }

    function onKeydown(e) {
//      console.log(e.code, e);
      keyboardHandler.handle(e);
      $scope.$safeApply();
    }

    $scope.debug = function() {
      console.log('drill', $scope.drill);
    };

    // used by openDrillDialog when a drill is chosen
    $scope.onOpen = function(drill) {
      console.log('onOpen');
      openDrill(drill);
    };
  });
