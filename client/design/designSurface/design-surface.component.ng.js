'use strict';

import Field from './field/Field';

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
        ctrl.field = new Field(ctrl.drill, $scope);
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

      $scope.$on('drillChanged', function() {
        ctrl.field.drillChanged();
      });

      $scope.$on('memberAdded', function(event, args) {
        ctrl.field.addMarchers(args.newMembers);
      });

      $scope.$on('designSurface:resize', function(){
        ctrl.field.resize();
      })

      $scope.$on("$destroy", function(){
        ctrl.field.canvas.dispose();
      });
      
      ctrl.$onInit = function() {
      }

      ctrl.$postLink = function() {
      }
    }
  });


