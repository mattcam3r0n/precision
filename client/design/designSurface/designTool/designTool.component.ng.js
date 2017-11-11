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

      $scope.addSteps = function() {
        $rootScope.$broadcast('designTool:activateAddStepsTool');                
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

      $scope.deleteBackspace = function() {
        $rootScope.$broadcast('designTool:deleteBackspace');
      }

      $scope.deleteForward = function() {
        $rootScope.$broadcast('designTool:deleteForward');
      }

      $scope.showPaths = function() {
        $rootScope.$broadcast('designTool:showPaths');
      }

      $scope.hideUnselected = function() {
        $rootScope.$broadcast('designTool:hideUnselected');
      }

      $scope.showAll = function() {
        $rootScope.$broadcast('designTool:showAll');
      }
    }
  });


