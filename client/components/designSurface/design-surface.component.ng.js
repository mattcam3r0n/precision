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
        ctrl.field = new Field(ctrl.drill);
        $scope.showSpinner = false;
        console.log('timeout render');
      });

      angular.element($window).bind('resize', function () {
        ctrl.field.resize();
      });

      $scope.$on('memberAdded', function(event, args) {
        console.log('memberAdded', args);
        ctrl.field.addMarchers(args.newMembers);
      });

      $scope.$on("$destroy", function(){
        //$interval.cancel(myInterval);
        console.log('$destroy design surface component');
        ctrl.field.canvas.dispose();
      });
      
      ctrl.$onInit = function() {
        console.log('design surface onInit');
      }

      ctrl.$postLink = function() {
        console.log('design surface post link');
      }
    }
  });


