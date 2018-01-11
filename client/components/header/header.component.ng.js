'use strict'

import Events from '/client/lib/Events';

angular.module('drillApp')
  .component('header', {
    templateUrl: 'client/components/header/header.component.ng.html',
    bindings: {
    },
    controller: function ($scope, $rootScope, eventService, appStateService) {
      var ctrl = this;

      ctrl.$onInit = function() {

      }

      ctrl.$onDestroy = function() {

      }

      ctrl.onNewDrill = function() {
        eventService.notify(Events.newDrill);
      }

      ctrl.onOpenDrill = function() {
        eventService.notify(Events.showOpenDrillDialog);
      }

      ctrl.onDrillProperties = function() {
        eventService.notify(Events.showDrillPropertiesDialog);
      }

      ctrl.onDebug = function() {
        console.log(appStateService.drill);
      }
    }
  });