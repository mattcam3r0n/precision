'use strict';

import FieldDimensions from '/client/lib/FieldDimensions';
import Direction from '/client/lib/Direction';
import MarcherFactory from '../field/MarcherFactory';
import SizableRect from './SizableRect';
import DrillBuilder from '/client/lib/drill/DrillBuilder';
import PositionCalculator from '/client/lib/PositionCalculator';
import Events from '/client/lib/Events';

angular.module('drillApp')
  .component('addMemberTool', {
    templateUrl: 'client/design/designSurface/addMemberTool/addMemberTool.view.ng.html',
    bindings: {
      field: '<',
    },
    controller: function($scope, $window, drillEditorService, eventService) {
      let ctrl = this;
      let toolDiv = angular.element('.add-member-tool')[0];
      let builder = new DrillBuilder();
      let directionClass = {
        [Direction.N]: 'fa-caret-up',
        [Direction.E]: 'fa-caret-right',
        [Direction.S]: 'fa-caret-down',
        [Direction.W]: 'fa-caret-left',
      };

      ctrl.$onInit = function() {
        ctrl.isActivated = false;
        ctrl.subscriptions = eventService.createSubscriptionManager();

        ctrl.subscriptions.subscribe(Events.addMembersToolActivated, () => {
          activate();
        });

        ctrl.subscriptions.subscribe(Events.strideTypeChanged, (evt, args) => {
          if (!ctrl.isActivated) return;
          activate();
        });
      };

      ctrl.$onDestroy = function() {
        ctrl.field = null;
        ctrl.subscriptions.unsubscribeAll();
      };

      $scope.activate = activate;

      $scope.deactivate = function() {
      };

      $scope.setDirection = function(dir) {
        ctrl.direction = dir;
        updateMarchers(ctrl.sizableRect);
      };

      $scope.setFileSpacing = function(s) {
        ctrl.fileSpacing = s;
        updateMarchers(ctrl.sizableRect);
      };

      $scope.setRankSpacing = function(s) {
        ctrl.rankSpacing = s;
        updateMarchers(ctrl.sizableRect);
      };

      $scope.getDirectionClass = function() {
        return directionClass[ctrl.direction];
      };

      $scope.save = function() {
        updateMarchers(ctrl.sizableRect);
        drillEditorService.addMembers(ctrl.members);
        deactivate();
        eventService.notify(Events.updateField);
      };

      $scope.cancel = deactivate;

      function activate() {
        if (ctrl.isActivated) {
          deactivate();
        }

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

        ctrl.field.canvas.on('sizableRect:sizing', (r) => {
          updateMarchers(r);
        });

        ctrl.field.canvas.on('sizableRect:moving', (r) => {
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
        eventService.notify(Events.updateField);
      }

      function updateMarchers(r) {
        destroyMarcherGroup();
        ctrl.group = createMarcherGroup();
        updateLabels(r);
      }

      function positionTools(obj) {
        let absCoords = ctrl.field.getAbsoluteCoords(obj);
        let left = absCoords.left - 70;
        if (left < 0) {
          left = absCoords.left + absCoords.width + 20;
        }
        let top = absCoords.top;
        toolDiv.style.left = left + 'px';
        toolDiv.style.top = top + 'px';
      }

      function createMarcherGroup() {
        ctrl.marchers = [];
        ctrl.members = [];
        let files = getFilesInRect(ctrl.sizableRect);
        let ranks = getRanksInRect(ctrl.sizableRect);
        let x = 0;
        let y = 0;
        let stepSize = FieldDimensions.getStepSize(ctrl.strideType);
        for (let i = 0; i < files; i++) {
          for (let j = 0; j < ranks; j++) {
            let upperLeftOfRect = {
              x: ctrl.sizableRect.left
                  + ctrl.sizableRect.marcherOffsetX,
              y: ctrl.sizableRect.top
                  + ctrl.sizableRect.marcherOffsetY,
            };
            let upperLeftInSteps = FieldDimensions.toStepPoint(upperLeftOfRect,
              ctrl.strideType);
            let stepPoint = FieldDimensions.toStepPoint({
                x: upperLeftInSteps.x + x,
                y: upperLeftInSteps.y + y,
              }, ctrl.strideType);
            let member = builder.createMember(ctrl.strideType,
              ctrl.direction, stepPoint);
            ctrl.members.push(member);

            let marcher = createMarcher(ctrl.strideType, stepPoint.x,
              stepPoint.y, ctrl.direction);
            ctrl.marchers.push(marcher);

            y += (ctrl.rankSpacing * stepSize.y);
          }
          x += (ctrl.fileSpacing * stepSize.x);
          y = 0;
        }

        ctrl.files = files;
        ctrl.ranks = ranks;

        let g = new fabric.Group(ctrl.marchers, {
          left: ctrl.sizableRect.left,
          top: ctrl.sizableRect.top,
          selectable: false,
        });

        ctrl.field.canvas.add(g);
        g.sendBackwards();
        ctrl.sizableRect.rect.bringToFront();
        ctrl.field.canvas.renderAll();
        return g;
      }

      function createMarcher(strideType, x, y, dir) {
        let marcher = MarcherFactory.createMarcher({
          strideType: strideType,
          x: x,
          y: y,
          direction: dir,
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
          let m = ctrl.marchers.pop();
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
        let stepSize = FieldDimensions.getStepSize(ctrl.strideType);
        return Math.floor(rect.width / stepSize.x / ctrl.fileSpacing);
      }

      function getRanksInRect(rect) {
        let stepSize = FieldDimensions.getStepSize(ctrl.strideType);
        return Math.floor(rect.height / stepSize.y / ctrl.rankSpacing);
      }

      function updateLabels(rect) {
        let ranks = getRanksInRect(rect);
        let files = getFilesInRect(rect);

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

        let upperLeft = ctrl.sizableRect.position();
        let p = PositionCalculator.getPositionDescription({
          x: upperLeft.left,
          y: upperLeft.top,
        });
        $scope.$emit('positionIndicator', { position: p });
      }

      function createLabels() {
        let labels = {};
        let labelOptions = {
          fontSize: 20,
          fontWeight: 'bold',
          fill: 'white',
          lineHeight: 1,
          selectable: false,
          evented: false,
        };
        labels.rankLabel = new fabric.Text('', labelOptions);
        labels.fileLabel = new fabric.Text('', labelOptions);
        labels.totalLabel = new fabric.Text('', labelOptions);
        ctrl.field.canvas.add(labels.rankLabel);
        ctrl.field.canvas.add(labels.fileLabel);
        ctrl.field.canvas.add(labels.totalLabel);
        return labels;
      }
    },
  });


