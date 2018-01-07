'use strict';

import StrideType from '/client/lib/StrideType';
import FieldDimensions from '/client/lib/FieldDimensions';
import Direction from '/client/lib/Direction';

angular.module('drillApp')
  .component('sidebar', {
    templateUrl: 'client/design/sidebar/sidebar.view.ng.html',
    bindings: {
      field: '<'
    },
    controller: function ($scope, drillEditorService, eventService) {
      var ctrl = this;

      ctrl.$onInit = function () {
        initStrideTypeSwitch();
        initGridSwitch();
        initLogoSwitch();
        initCollapseHighlighting();
      }

      $scope.isOpened = function(e) {
        console.log(e);
      }

      $scope.addMembers = function () {
        eventService.notifyAddMembersToolActivated();
      }

      $scope.deleteSelectedMembers = function () {
        drillEditorService.deleteSelectedMembers();
      }

      $scope.addSteps = function () {
        console.log('addsteps');
        eventService.notifyAddStepsToolActivated();
      }

      $scope.drawPaths = function () {
        console.log('drawpaths');
        eventService.notifyDrawPathsToolActivated();
      }

      $scope.deselectAll = function () {
        drillEditorService.deselectAll();
      }

      $scope.selectAll = function () {
        drillEditorService.selectAll();
      }

      $scope.deleteBackspace = function () {
        drillEditorService.deleteBackspace();
      }

      $scope.deleteForward = function () {
        drillEditorService.deleteForward();
      }

      $scope.showPaths = function () {
        drillEditorService.showPaths();
        // $rootScope.$broadcast('designTool:showPaths');
      }

      $scope.hideUnselected = function () {
        drillEditorService.hideUnselected();
      }

      $scope.showAll = function () {
        drillEditorService.showAll();
      }

      $scope.sizeToFit = function() {
        eventService.notifySizeToFit();
      }
  
      $scope.zoomIn = function() {
        eventService.notifyZoomIn();
      }
  
      $scope.zoomOut = function() {
        eventService.notifyZoomOut();
      }

      function initStrideTypeSwitch() {
        // bootstrap toggle button
        $("[name='stride-type-switch']").bootstrapSwitch('state', drillEditorService.strideType);
        $("input[name='stride-type-switch']").on('switchChange.bootstrapSwitch', function (event, state) {
          if (state) {
            drillEditorService.strideType = StrideType.EightToFive;
          } else {
            drillEditorService.strideType = StrideType.SixToFive;
          }
          // sync other stride switches
          $("[name='stride-type-switch']").bootstrapSwitch('state', state);
        });        
      }

      function initGridSwitch() {
        // bootstrap toggle button
        $("[name='grid-switch']").bootstrapSwitch('state', $scope.showGrid);
        $("input[name='grid-switch']").on('switchChange.bootstrapSwitch', function (event, state) {
          if (state) {
            // show grid
          } else {
            // turn off grid
          }
        });        
      }

      function initLogoSwitch() {
        // bootstrap toggle button
        $("[name='logo-switch']").bootstrapSwitch('state', $scope.showLogo);
        $("input[name='logo-switch']").on('switchChange.bootstrapSwitch', function (event, state) {
          if (state) {
            // show logo
          } else {
            // turn off logo
          }
        });        
      }

      function initCollapseHighlighting() {
        // add class to highlight opened menu
        $('div.collapse').on('hidden.bs.collapse', function (args) {
          $(args.currentTarget.parentElement).removeClass('opened');
        });
        $('div.collapse').on('shown.bs.collapse', function (args) {
          $(args.currentTarget.parentElement).addClass('opened');
        });        
      }
        
    }
  });


