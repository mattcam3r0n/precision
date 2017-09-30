'use strict';

import StrideType from '/client/lib/StrideType';
import FieldDimensions from '/client/lib/FieldDimensions';
import Direction from '/client/lib/Direction';

angular.module('drillApp')
  .component('designTool', {
    templateUrl: 'client/components/designSurface/designTool/designTool.view.ng.html',
    bindings: {
      field: '<'
    },
    controller: function ($scope, $window, $rootScope) {
      var ctrl = this;

      ctrl.isActivated = true;

      $scope.addMembers = function() {
        $rootScope.$broadcast('activateAddMemberTool');        
      }
    }
  });


