'use strict';

import StrideType from '/client/lib/StrideType';
import FieldDimensions from '/client/lib/FieldDimensions';
import Direction from '/client/lib/Direction';
import MarcherFactory from '../field/MarcherFactory';
import SizableRect from './SizableRect';

angular.module('drillApp')
  .component('addMemberTool', {
    templateUrl: 'client/components/designSurface/addMemberTool/addMemberTool.view.ng.html',
    bindings: {
      field: '<'
    },
    controller: function ($scope, $window) {
      var ctrl = this;
      var toolDiv = angular.element('.add-member-tool')[0];
      var directionClass = {
        [Direction.N]: 'fa-caret-up',
        [Direction.E]: 'fa-caret-right',
        [Direction.S]: 'fa-caret-down',
        [Direction.W]: 'fa-caret-left'
      };     

      $scope.$on('activateAddMemberTool', function() {
        activate();
      });

      $scope.$onInit = function() {

      }

      $scope.$onDestroy = function() {

      }

      $scope.activate = activate;

      $scope.deactivate = function() {

      }

      $scope.setDirection = function(dir) {
        ctrl.direction = dir;
        updateMarchers(ctrl.sizableRect);
        console.log(ctrl.direction);
      };

      $scope.setFileSpacing = function(s) {
        ctrl.fileSpacing = s;
        updateMarchers(ctrl.sizableRect);
      }

      $scope.setRankSpacing = function(s) {
        ctrl.rankSpacing = s;
        updateMarchers(ctrl.sizableRect);
      }

      $scope.getDirectionClass = function() {
        return directionClass[ctrl.direction];
      };

      $scope.save = function() {

      }

      $scope.cancel = deactivate;

      function activate() {
        ctrl.isActivated = true;
        ctrl.field.canvas.selection = false;
        
        ctrl.marchers = [];
        ctrl.direction = Direction.E;
        ctrl.fileSpacing = 2;
        ctrl.rankSpacing = 2;
            
        ctrl.sizableRect = new SizableRect(ctrl.field);
        ctrl.group = createMarcherGroup();
        ctrl.label = createLabel();
  
        positionTools(ctrl.sizableRect);
  
        ctrl.field.canvas.on('sizableRect:sizing', r => {
          updateMarchers(r);
        });
    
        ctrl.field.canvas.on('sizableRect:moving', r => {
          positionTools(r);
          ctrl.group.left = r.left;
          ctrl.group.top = r.top;
          updateLabel(r);
        });
      }

      function deactivate() {
        ctrl.isActivated = false;
        destroyMarcherGroup();
        destroySizableRect();
        destroyLabel();
      }

      function updateMarchers(r) {
        destroyMarcherGroup();
        ctrl.group = createMarcherGroup();
        updateLabel(r);        
      }

      function positionTools(obj) {
        var absCoords = ctrl.field.getAbsoluteCoords(obj);
        var left = absCoords.left - 50;
        if (left < 0) {
          left = absCoords.left + absCoords.width + 20;
        }
        var top = absCoords.top - 20;
        toolDiv.style.left = left + 'px';
        toolDiv.style.top = top + 'px';
      }

      function snap(evt) {
        var snappedPoint = FieldDimensions.snapPoint(StrideType.SixToFive, { x: evt.target.left, y: evt.target.top });
        evt.target.set({
          left: snappedPoint.x,
          top: snappedPoint.y
        });        
      }

      function createMarcherGroup() {
        ctrl.marchers = [];
        var files = getFilesInRect(ctrl.sizableRect);
        var ranks = getRanksInRect(ctrl.sizableRect);
        var x, y;
        for(var i = 0; i < files; i++){
          x = i * FieldDimensions.oneStepX_6to5 * ctrl.fileSpacing;
          for (var j = 0; j < ranks; j++){
            y = j * FieldDimensions.oneStepY_6to5 * ctrl.rankSpacing;
            var marcher = MarcherFactory.createMarcher({ 
              x: x,
              y: y,
              direction: ctrl.direction 
            });
            marcher.originX = 'center';
            marcher.originY = 'center';
            marcher.lockMovementX = false;
            marcher.lockMovementY = false;
            ctrl.marchers.push(marcher);
          }
        }
        
        ctrl.files = files;
        ctrl.ranks = ranks;

        var g = new fabric.Group(ctrl.marchers, {
          left: ctrl.sizableRect.left,
          top: ctrl.sizableRect.top,
          selectable: false
        });

        ctrl.field.canvas.add(g);
        g.sendBackwards();
        ctrl.sizableRect.rect.bringForward();
        ctrl.field.canvas.renderAll();
        return g;
      }

      function destroyMarcherGroup() {
        while (ctrl.marchers.length > 0){
          var m = ctrl.marchers.pop();
          ctrl.group.remove(m);
          ctrl.field.canvas.remove(m);
        }
        ctrl.field.canvas.remove(ctrl.group);
        ctrl.group = null;
      }

      function destroyLabel() {
        ctrl.field.canvas.remove(ctrl.label);
        ctrl.label = null;
      }

      function destroySizableRect() {
        ctrl.sizableRect.destroy();
        ctrl.sizableRect = null;
      }

      function getFilesInRect(rect) {
        return Math.floor(rect.width / (FieldDimensions.oneStepX_6to5) / ctrl.fileSpacing);		
      }
      
      function getRanksInRect(rect) {
        return Math.floor(rect.height / (FieldDimensions.oneStepY_6to5) / ctrl.rankSpacing);		
      }
    
      function updateLabel(rect) {
        var ranks = getRanksInRect(rect),
            files = getFilesInRect(rect);
        ctrl.label.setText(`${files} x ${ranks} = ${files * ranks}`);
        ctrl.label.set('left', rect.left);
        ctrl.label.set('top', rect.top - 25);
      }

      function createLabel() {
        var label = new fabric.Text("", {
          fontSize: 20,
          lineHeight: 1,
          selectable: false,
          evented: false
        });
        ctrl.field.canvas.add(label);
        return label;
      }

    }
  });


