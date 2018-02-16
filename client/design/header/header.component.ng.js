'use strict';

import Events from '/client/lib/Events';

angular.module('drillApp')
  .component('designHeader', {
    templateUrl: 'client/design/header/header.component.ng.html',
    bindings: {
    },
    controller: function($scope,
              $location,
              eventService,
              appStateService,
              drillEditorService,
              userService
            ) {
      let ctrl = this;

      ctrl.$onInit = function() {
        // $('[data-toggle="tooltip"]').tooltip();
        ctrl.subscriptions = eventService.subscribe(Events.drillOpened,
              onDrillOpened);
      };

      ctrl.$onChanges = function(changes) {
        $scope.drillName = drillEditorService.drill.name;
      };

      ctrl.$onDestroy = function() {

      };

      ctrl.onNewDrill = function() {
        eventService.notify(Events.newDrill);
      };

      ctrl.onOpenDrill = function() {
        eventService.notify(Events.showOpenDrillDialog);
      };

      ctrl.onDrillProperties = function() {
        eventService.notify(Events.showDrillPropertiesDialog);
      };

      ctrl.onDebug = function() {
        console.log(drillEditorService.drill);
      };

      ctrl.focusDrillName = function() {
        angular.element('#txtDrillName').focus();
      };

      ctrl.drillName = function() {
        if (!drillEditorService.drill) return;

        return drillEditorService.drill.name;
      };

      ctrl.userName = function() {
        return userService.getUserEmail();
      };

      ctrl.isAdmin = function() {
        return userService.isAdmin();
      };

      ctrl.goToAdmin = function() {
        $location.path('/admin');
      };

      ctrl.logOut = function() {
        userService.logOut();
      };

      $scope.onNameChange = function() {
        appStateService.drill.name = $scope.drillName;
        drillEditorService.save(true);
      };

      function onDrillOpened() {
        $scope.drillName = appStateService.drill.name;
      }
    },
  });
