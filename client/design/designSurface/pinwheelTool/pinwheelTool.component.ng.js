'use strict';

import Events from '/client/lib/Events';
import EventSubscriptionManager from '/client/lib/EventSubscriptionManager';
import { FieldPoint, StepPoint } from '/client/lib/Point';
import FieldDimensions from '/client/lib/FieldDimensions';
import Direction from '/client/lib/Direction';

angular.module('drillApp')
  .component('pinwheelTool', {
    templateUrl: 'client/design/designSurface/pinwheelTool/pinwheelTool.view.ng.html',
    bindings: {
    },
    controller: function ($scope, $window, appStateService, drillEditorService, eventService) {
      var ctrl = this;

      ctrl.$onInit = function () {
        ctrl.subscriptions = new EventSubscriptionManager(eventService);

        ctrl.subscriptions.subscribe(Events.pinwheelToolActivated, () => {
          //activate(drillEditorService.getMemberSelection());
        });

        ctrl.subscriptions.subscribe(Events.strideTypeChanged, (evt, args) => {
          if (!ctrl.isActivated) return;
          //activate(drillEditorService.getMemberSelection());
        });

        ctrl.turnDirection = 'clockwise';
        ctrl.rotation = .25; // 1/4, 1/2, 3/4, full
        ctrl.counts = 8;
      }

      ctrl.$onDestroy = function () {
        ctrl.subscriptions.unsubscribeAll();
      }

      $scope.save = function () {
        save();
        deactivate();
      }

      $scope.cancel = deactivate;

      function activate(memberSelection) {

        if (ctrl.isActivated)
          deactivate();

        ctrl.isActivated = true;
        ctrl.field = appStateService.field;
        ctrl.memberSelection = memberSelection;
        ctrl.strideType = drillEditorService.strideType;

//        createPathTool();

        ctrl.field.disablePositionIndicator();
        ctrl.subscriptions.subscribe(Events.membersSelected, (evt, args) => {
          if (!ctrl.isActivated) return;
          ctrl.memberSelection = args.memberSelection;
//          createPathTool();
        });
      }

      function deactivate() {
        ctrl.subscriptions.unsubscribe(Events.membersSelected);

        ctrl.isActivated = false;
        ctrl.field.enablePositionIndicator();
        ctrl.field.canvas.selection = true;
        ctrl.field.canvas.defaultCursor = 'default';
//        destroyPathTool();
        eventService.notify(Events.updateField);
        eventService.notify(Events.pinwheelToolDeactivated);
      }


      function createPathTool() {
        //if (ctrl.memberSelection.members.length == 0) return;

        if (ctrl.activePathTool)
          destroyPathTool();

        ctrl.activePathTool = new PathTool(ctrl.field, ctrl.memberSelection, ctrl.turnMode, ctrl.strideType);
        eventService.notify(Events.updateField);
      }

      function destroyPathTool() {
        if (!ctrl.activePathTool) return;

        ctrl.activePathTool.dispose();
      }

      function save() {

        drillEditorService.save(true);
      }

    }
  });


