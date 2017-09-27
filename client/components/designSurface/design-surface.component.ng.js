'use strict';

import Drill from '/client/lib/drill/Drill';
import Field from './field/Field';

angular.module('drillApp')
  .component('designSurface', {
    templateUrl: 'client/components/designSurface/design-surface.view.ng.html',
    bindings: {
      drill: '<'
    },
    controller: function ($scope, $window) {
      var ctrl = this;

      ctrl.field = new Field(ctrl.drill);

      angular.element($window).bind('resize', function () {
        ctrl.field.resize();
      });

      $scope.$on('memberAdded', function(event, args) {
        console.log('memberAdded', args);
        ctrl.field.addMarchers(args.newMembers);
      });
    }
  });


