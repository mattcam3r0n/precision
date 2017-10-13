'use strict';

import StrideType from '/client/lib/StrideType';
import FieldDimensions from '/client/lib/FieldDimensions';
import Direction from '/client/lib/Direction';
import MarcherFactory from '../field/MarcherFactory';
import SizableRect from './SizableRect';
import DrillBuilder from '/client/lib/drill/DrillBuilder';
import PositionCalculator from '/client/lib/PositionCalculator';

angular.module('drillApp')
  .component('addStepsTool', {
    templateUrl: 'client/design/designSurface/addStepsTool/addStepsTool.view.ng.html',
    bindings: {
      field: '<'
    },
    controller: function ($scope, $window) {
      var ctrl = this;
      var toolDiv = angular.element('.add-steps-tool')[0];
      var builder = new DrillBuilder();
      var directionClass = {
        [Direction.N]: 'fa-caret-up',
        [Direction.E]: 'fa-caret-right',
        [Direction.S]: 'fa-caret-down',
        [Direction.W]: 'fa-caret-left'
      };

      $scope.$on('design:activateAddStepsTool', function () {
        console.log('activate event');
        activate();
      });

      ctrl.$onInit = function () {
      }

      ctrl.$onDestroy = function () {
      }

      $scope.activate = activate;

      $scope.deactivate = function () {
      }

      $scope.save = function () {
        deactivate();
      }

      $scope.cancel = deactivate;

      function activate() {
        console.log('activate');
        if (ctrl.isActivated)
          deactivate();

        ctrl.isActivated = true;

        positionTools();
      }

      function deactivate() {
        ctrl.isActivated = false;
        ctrl.field.enablePositionIndicator();
        destroyMarcherGroup();
        destroySizableRect();
        destroyLabels();
        ctrl.field.canvas.selection = true;
      }


      function positionTools(obj) {
        // TODO
        // var absCoords = ctrl.field.getAbsoluteCoords(obj);
        // var left = absCoords.left - 50;
        // if (left < 0) {
        //   left = absCoords.left + absCoords.width + 20;
        // }
        // var top = absCoords.top - 100;
        toolDiv.style.left = 100 + 'px';
        toolDiv.style.top = 100 + 'px';
      }




    }
  });


