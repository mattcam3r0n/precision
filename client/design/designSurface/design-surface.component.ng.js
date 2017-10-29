'use strict';

import FieldController from './field/FieldController';

angular.module('drillApp')
  .component('designSurface', {
    templateUrl: 'client/design/designSurface/design-surface.view.ng.html',
    bindings: {
      drill: '<'
    },
    controller: function ($scope, $window, $timeout, $rootScope, appStateService) {
      var ctrl = this;
      $scope.showSpinner = true;

      $timeout(function(){
        ctrl.field = new FieldController(ctrl.drill, $scope);
        $scope.showSpinner = false;
      });

      ctrl.$onChanges = function(changes) {
        // if the drill changed, update field
        if (!ctrl.field) return;
        ctrl.field.setDrill(ctrl.drill);
      }

      angular.element($window).bind('resize', function () {
        ctrl.field.resize();
      });

      $scope.$on('design:drillStateChanged', function(evt, args) {
        if (!ctrl.field) return;
        ctrl.field.drillStateChanged(args);
      });

      $scope.$on('design:membersAdded', function(event, args) {
        ctrl.field.membersChanged();
      });

      $scope.$on('designSurface:resize', function(){
        ctrl.field.resize();
      })

      $scope.$on("$destroy", function(){
        ctrl.field.canvas.dispose();
      });
      
      // ctrl.$onInit = function() {
      // }

      // ctrl.$postLink = function() {
      // }
    }
  });


