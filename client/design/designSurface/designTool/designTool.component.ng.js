'use strict';

import StrideType from '/client/lib/StrideType';
import FieldDimensions from '/client/lib/FieldDimensions';
import Direction from '/client/lib/Direction';

angular.module('drillApp')
  .component('designTool', {
    templateUrl: 'client/design/designSurface/designTool/designTool.view.ng.html',
    bindings: {
      field: '<'
    },
    controller: function ($scope, $window, $rootScope) {
      var ctrl = this;

      $("[name='follow-switch']").bootstrapSwitch();
      ctrl.isActivated = true;

      $scope.addMembers = function() {
        $rootScope.$broadcast('designTool:activateAddMemberTool');        
      }

      $scope.deleteSelectedMembers = function() {
        $rootScope.$broadcast('designTool:deleteSelectedMembers');
      }

      $scope.drawPath = function() {
        $rootScope.$broadcast('designTool:activateAddTurnsTool');                
      }

      $scope.deselectAll = function() {
        $rootScope.$broadcast('designTool:deselectAll');
      }

      $scope.selectAll = function() {
        $rootScope.$broadcast('designTool:selectAll');
      }

      $scope.deleteForward = function() {
        $rootScope.$broadcast('designTool:deleteForward');
      }
    }
  });


