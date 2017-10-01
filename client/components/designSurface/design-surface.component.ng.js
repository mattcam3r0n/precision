'use strict';

import Drill from '/client/lib/drill/Drill';
import Field from './field/Field';

angular.module('drillApp')
  .component('designSurface', {
    templateUrl: 'client/components/designSurface/design-surface.view.ng.html',
    bindings: {
      drill: '<'
    },
    controller: function ($scope, $window, $timeout) {
      var ctrl = this;
      $scope.showSpinner = true;

      $timeout(function(){
        ctrl.field = new Field(ctrl.drill, $scope);
        $scope.showSpinner = false;
      });

      angular.element($window).bind('resize', function () {
        ctrl.field.resize();
      });

      $scope.$on('memberAdded', function(event, args) {
        ctrl.field.addMarchers(args.newMembers);
      });

      $scope.$on('designSurface:resize', function(){
        ctrl.field.resize();
        console.log('resize');
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


