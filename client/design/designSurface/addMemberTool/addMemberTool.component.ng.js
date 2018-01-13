'use strict';

import StrideType from '/client/lib/StrideType';
import FieldDimensions from '/client/lib/FieldDimensions';
import Direction from '/client/lib/Direction';
import MarcherFactory from '../field/MarcherFactory';
import SizableRect from './SizableRect';
import DrillBuilder from '/client/lib/drill/DrillBuilder';
import PositionCalculator from '/client/lib/PositionCalculator';
import Events from '/client/lib/Events';
import EventSubscriptionManager from '/client/lib/EventSubscriptionManager';

angular.module('drillApp')
  .component('addMemberTool', {
    templateUrl: 'client/design/designSurface/addMemberTool/addMemberTool.view.ng.html',
    bindings: {
      field: '<'
    },
    controller: function ($scope, $window, drillEditorService, eventService) {
      var ctrl = this;
      var toolDiv = angular.element('.add-member-tool')[0];
      var builder = new DrillBuilder();
      var directionClass = {
        [Direction.N]: 'fa-caret-up',
        [Direction.E]: 'fa-caret-right',
        [Direction.S]: 'fa-caret-down',
        [Direction.W]: 'fa-caret-left'
      };

      ctrl.$onInit = function () {
        ctrl.isActivated = false;
        ctrl.subscriptions = new EventSubscriptionManager(eventService);

        ctrl.subscriptions.subscribe(Events.addMembersToolActivated, () => {
          activate();
        });
  
        ctrl.subscriptions.subscribe(Events.strideTypeChanged, (evt, args) => {
          if (!ctrl.isActivated) return;
          console.log('strideTypeChanged');
          activate();
        });
      }

      ctrl.$onDestroy = function () {
        ctrl.unsubscribeAll();
      }

      $scope.activate = activate;

      $scope.deactivate = function () {
      }

      $scope.setDirection = function (dir) {
        ctrl.direction = dir;
        updateMarchers(ctrl.sizableRect);
      };

      $scope.setFileSpacing = function (s) {
        ctrl.fileSpacing = s;
        updateMarchers(ctrl.sizableRect);
      }

      $scope.setRankSpacing = function (s) {
        ctrl.rankSpacing = s;
        updateMarchers(ctrl.sizableRect);
      }

      $scope.getDirectionClass = function () {
        return directionClass[ctrl.direction];
      };

      $scope.save = function () {
        updateMarchers(ctrl.sizableRect);
        drillEditorService.addMembers(ctrl.members);
        deactivate();
        eventService.notifyUpdateField();
      }

      $scope.cancel = deactivate;

      function activate() {
        if (ctrl.isActivated)
          deactivate();

        ctrl.isActivated = true;
        ctrl.field.canvas.selection = false;

        ctrl.direction = Direction.E;
        ctrl.strideType = drillEditorService.strideType;
        ctrl.fileSpacing = 2;
        ctrl.rankSpacing = 2;

        ctrl.sizableRect = new SizableRect(ctrl.field, ctrl.strideType);
        ctrl.group = createMarcherGroup();
        ctrl.labels = createLabels();

        positionTools(ctrl.sizableRect);
        updateLabels(ctrl.sizableRect);
        updatePosition(ctrl.sizableRect);

        ctrl.field.disablePositionIndicator();

        ctrl.field.canvas.on('sizableRect:sizing', r => {
          updateMarchers(r);
        });

        ctrl.field.canvas.on('sizableRect:moving', r => {
          positionTools(r);
          ctrl.group.left = r.left;
          ctrl.group.top = r.top;
          updateLabels(r);
          updatePosition(r);
        });
      }

      function deactivate() {
        ctrl.isActivated = false;
        ctrl.field.enablePositionIndicator();
        destroyMarcherGroup();
        destroySizableRect();
        destroyLabels();
        ctrl.field.canvas.selection = true;
        eventService.notifyUpdateField();
      }

      function updateMarchers(r) {
        destroyMarcherGroup();
        ctrl.group = createMarcherGroup();
        updateLabels(r);
      }

      function positionTools(obj) {
        var absCoords = ctrl.field.getAbsoluteCoords(obj);
        var left = absCoords.left - 70;
        if (left < 0) {
          left = absCoords.left + absCoords.width + 20;
        }
        var top = absCoords.top;
        toolDiv.style.left = left + 'px';
        toolDiv.style.top = top + 'px';
      }

      function createMarcherGroup() {
        ctrl.marchers = [];
        ctrl.members = [];
        var files = getFilesInRect(ctrl.sizableRect);
        var ranks = getRanksInRect(ctrl.sizableRect);
        var x = 0, y = 0;
        var stepSize = FieldDimensions.getStepSize(ctrl.strideType);
        for (var i = 0; i < files; i++) {
          for (var j = 0; j < ranks; j++) {
            var upperLeftOfRect = { x: ctrl.sizableRect.left + ctrl.sizableRect.marcherOffsetX, y: ctrl.sizableRect.top + ctrl.sizableRect.marcherOffsetY };
            var upperLeftInSteps = FieldDimensions.toStepPoint(upperLeftOfRect, ctrl.strideType);
            var stepPoint = FieldDimensions.toStepPoint({ x: upperLeftInSteps.x + x, y: upperLeftInSteps.y + y }, ctrl.strideType);
            var member = builder.createMember(ctrl.strideType, ctrl.direction, stepPoint);
            ctrl.members.push(member);

            var marcher = createMarcher(ctrl.strideType, stepPoint.x, stepPoint.y, ctrl.direction);            
            ctrl.marchers.push(marcher);

            y += (ctrl.rankSpacing * stepSize.y);
          }
          x += (ctrl.fileSpacing * stepSize.x);
          y = 0;
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
        ctrl.sizableRect.rect.bringToFront();
        ctrl.field.canvas.renderAll();
        return g;
      }

      function createMarcher(strideType, x, y, dir) {
        var marcher = MarcherFactory.createMarcher({
          strideType: strideType,
          x: x,
          y: y,
          direction: dir
        });
        marcher.originX = 'center';
        marcher.originY = 'center';
        marcher.lockMovementX = false;
        marcher.lockMovementY = false;
        marcher.evented = false;
        marcher.selectable = false;
        return marcher;
      }

      function destroyMarcherGroup() {
        while (ctrl.marchers.length > 0) {
          var m = ctrl.marchers.pop();
          ctrl.group.remove(m);
          ctrl.field.canvas.remove(m);
        }
        ctrl.field.canvas.remove(ctrl.group);
        ctrl.members = [];
        ctrl.group = null;
      }

      function destroyLabels() {
        ctrl.field.canvas.remove(ctrl.labels.rankLabel);
        ctrl.field.canvas.remove(ctrl.labels.fileLabel);
        ctrl.field.canvas.remove(ctrl.labels.totalLabel);
        ctrl.labels.rankLabel = null;
        ctrl.labels.fileLabel = null;
        ctrl.labels.totalLabel = null;
      }

      function destroySizableRect() {
        ctrl.sizableRect.destroy();
        ctrl.sizableRect = null;
      }

      function getFilesInRect(rect) {
        var stepSize = FieldDimensions.getStepSize(ctrl.strideType);
        return Math.floor(rect.width / stepSize.x / ctrl.fileSpacing);
      }

      function getRanksInRect(rect) {
        var stepSize = FieldDimensions.getStepSize(ctrl.strideType);
        return Math.floor(rect.height / stepSize.y / ctrl.rankSpacing);
      }

      function updateLabels(rect) {
        var ranks = getRanksInRect(rect),
            files = getFilesInRect(rect);

        ctrl.labels.rankLabel.setText(`${ranks}`);
        ctrl.labels.rankLabel.set('top', rect.top + (rect.height / 2) - 10);
        ctrl.labels.rankLabel.set('left', rect.left + rect.width + 10);

        ctrl.labels.fileLabel.setText(`${files}`);
        ctrl.labels.fileLabel.set('top', rect.top - 30);
        ctrl.labels.fileLabel.set('left', rect.left + (rect.width / 2) - 10);

        ctrl.labels.totalLabel.setText(`${files * ranks}`);
        ctrl.labels.totalLabel.set('top', rect.top + rect.height + 10);
        ctrl.labels.totalLabel.set('left', rect.left + (rect.width / 2) - 10);

        ctrl.field.canvas.renderAll();
      }

      function updatePosition(rect) {
        if (!ctrl.sizableRect) return; 

        var upperLeft = ctrl.sizableRect.position();
        var p = PositionCalculator.getPositionDescription({ x: upperLeft.left, y: upperLeft.top });
        $scope.$emit('positionIndicator', { position: p }); 
      }

      function createLabels() {
        var labels = {};
        var labelOptions = {
          fontSize: 20,
          fontWeight: 'bold',
          lineHeight: 1,
          selectable: false,
          evented: false
        };
        labels.rankLabel = new fabric.Text("", labelOptions);
        labels.fileLabel = new fabric.Text("", labelOptions);
        labels.totalLabel = new fabric.Text("", labelOptions);
        ctrl.field.canvas.add(labels.rankLabel);
        ctrl.field.canvas.add(labels.fileLabel);
        ctrl.field.canvas.add(labels.totalLabel);
        return labels;
      }

    }
  });


