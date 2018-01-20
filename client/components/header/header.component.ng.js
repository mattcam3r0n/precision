'use strict';

import Events from '/client/lib/Events';

angular.module('drillApp')
  .component('header', {
    templateUrl: 'client/components/header/header.component.ng.html',
    bindings: {
    },
    controller: function($scope, eventService,
              appStateService, drillEditorService) {
      let ctrl = this;

      ctrl.$onInit = function() {
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

      ctrl.drillName = function() {
        if (!drillEditorService.drill) return;

        return drillEditorService.drill.name;
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
