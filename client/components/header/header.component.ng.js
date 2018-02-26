'use strict';

angular.module('drillApp')
  .component('header', {
    templateUrl: 'client/components/header/header.component.ng.html',
    bindings: {
    },
    controller: function($scope, eventService,
              appStateService, drillEditorService) {
      let ctrl = this;

      ctrl.$onInit = function() {
      };

      ctrl.$onDestroy = function() {
      };
    },
  });
