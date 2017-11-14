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
    controller: function ($scope, $rootScope, drillEditorService, eventService) {
      var ctrl = this;

      $("[name='follow-switch']").bootstrapSwitch();
      ctrl.isActivated = true;

      $scope.addMembers = function() {
        eventService.notifyAddMembersToolActivated();
      }

      $scope.deleteSelectedMembers = function() {
        drillEditorService.deleteSelectedMembers();
      }

      $scope.addSteps = function() {
        eventService.notifyAddStepsToolActivated();         
      }

      $scope.drawPath = function() {
        eventService.notifyDrawPathsToolActivated();
      }

      $scope.deselectAll = function() {
        drillEditorService.deselectAll();
      }

      $scope.selectAll = function() {
        drillEditorService.selectAll();
      }

      $scope.deleteBackspace = function() {
        drillEditorService.deleteBackspace();
      }

      $scope.deleteForward = function() {
        drillEditorService.deleteForward();
      }

      $scope.showPaths = function() {
        $rootScope.$broadcast('designTool:showPaths');
      }

      $scope.hideUnselected = function() {
        drillEditorService.hideUnselected();
      }

      $scope.showAll = function() {
        drillEditorService.showAll();
      }
    }
  });


