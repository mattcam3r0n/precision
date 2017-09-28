'use strict';

import StrideType from '/client/lib/StrideType';
import FieldDimensions from '/client/lib/FieldDimensions';
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

      ctrl.marchers = [];
      ctrl.direction = 0;
      ctrl.fileSpacing = 2;
      ctrl.rankSpacing = 2;
          
      // ctrl.group = createGroup(ctrl.field.canvas);
      // ctrl.sizableRect = createRect(ctrl.field.canvas);

      // addMarchers(ctrl.group);


      ctrl.sizableRect = new SizableRect(ctrl.field);

      ctrl.field.canvas.on('sizableRect:sizing', r => {
        console.log('sizableRect:sizing', r);
      });

      ctrl.field.canvas.on('sizableRect:moving', r => {
        console.log('sizableRect:moving', r);        
      });

      // ctrl.field.canvas.on('object:scaling', (obj) => {
      //   removeMarchers(ctrl.group);
      //   addMarchers(ctrl.group);
      //   ctrl.field.canvas.renderAll();
      // });

      // ctrl.field.canvas.on('object:moving', (evt) => {
      //   ctrl.group.set('left', evt.target.left);
      //   ctrl.group.set('top', evt.target.top);
      //   ctrl.field.canvas.renderAll();
      // });


      function positionTools(obj) {
        var absCoords = ctrl.field.getAbsoluteCoords(obj);
        toolDiv.style.left = absCoords.left + 'px';
        toolDiv.style.top = absCoords.top + 'px';
      }

      function snap(evt) {
        var snappedPoint = FieldDimensions.snapPoint(StrideType.SixToFive, { x: evt.target.left, y: evt.target.top });
        evt.target.set({
          left: snappedPoint.x,
          top: snappedPoint.y
        });        
      }

      function addMarchers(group) {
        ctrl.marchers = [];
        var files = getFilesInRect(group);
        var ranks = getRanksInRect(group);
        var x, y;
        for(var i = 0; i < files; i++){
          x = i * FieldDimensions.oneStepX_6to5 * ctrl.fileSpacing;
          for (var j = 0; j < ranks; j++){
            y = j * FieldDimensions.oneStepY_6to5 * ctrl.rankSpacing;
            var marcher = MarcherFactory.createMarcher({ 
              x: x - group.width/2, 
              y: y - group.height/2, 
              direction: ctrl.direction 
            });
            
            marcher.lockMovementX = false;
            marcher.lockMovementY = false;
            marcher.originX = 'left';
            marcher.originY = 'top';
            
            group.add(marcher);
            ctrl.marchers.push(marcher);
          }
        }
        ctrl.files = files;
        ctrl.ranks = ranks;
      }

      function removeMarchers(group) {
        while (ctrl.marchers.length > 0){
          var m = ctrl.marchers.pop();
          group.remove(m);
          ctrl.field.canvas.remove(m);
        }
      }

      function getFilesInRect(rect) {
        return Math.ceil(rect.width / (FieldDimensions.oneStepX_6to5) / ctrl.fileSpacing);		
      }
      
      function getRanksInRect(rect) {
        return Math.ceil(rect.height / (FieldDimensions.oneStepY_6to5) / ctrl.rankSpacing);		
      }
    
      function createRect(canvas) {
        var rect = new fabric.Rect({
          left: 100,
          top: 100,
          width: 100,
          height: 100,
          fill: 'rgba(0,0,0,0)',
          stroke: 'black',
          strokeWidth: 1,
          opacity: .5,
          //strokeDashArray: [5, 5],
          borderColor: 'black',
          cornerColor: 'black',
          cornerStyle: 'circle',
          transparentCorners: false,
          snapAngle: 45
        });
        canvas.add(rect);
        canvas.setActiveObject(rect);

        // canvas.on('object:moving', (evt) => {
        //   snap(evt);           
        // });
        rect.on('moving', (evt) => { 
          positionTools(rect);
        });

        return rect;
      }

      function createGroup(canvas) {
        var rect = new fabric.Group([], {
          left: 100,
          top: 100,
          width: 100,
          height: 100,
          fill: 'rgba(0,0,0,0)',
          stroke: 'black',
          strokeWidth: 1,
          opacity: .5,
          //strokeDashArray: [5, 5],
          borderColor: 'black',
          cornerColor: 'black',
          cornerStyle: 'circle',
          transparentCorners: false,
          snapAngle: 45,
          selectable: true
        });
        canvas.add(rect);

        // canvas.on('object:moving', (evt) => {
        //   snap(evt);           
        // });
        rect.on('moving', (evt) => { 
          positionTools(rect);
        });

        return rect;
      }

    }
  });


