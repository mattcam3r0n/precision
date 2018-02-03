'use strict';

import Events from '/client/lib/Events';
import EventSubscriptionManager from '/client/lib/EventSubscriptionManager';
import FieldController from './field/FieldController';

angular.module('drillApp')
  .component('designSurface', {
    templateUrl: 'client/design/designSurface/design-surface.view.ng.html',
    bindings: {
      drill: '<',
    },
    controller: function($scope, $window, $timeout, $location,
        appStateService, drillEditorService, eventService) {
      let ctrl = this;

      ctrl.$onInit = function() {
        ctrl.subscriptions = new EventSubscriptionManager(eventService);
        eventService.notify(Events.showSpinner);
        $timeout(function() {
          ctrl.field = new FieldController(ctrl.drill, eventService);
          appStateService.field = ctrl.field;
          eventService.notify(Events.hideSpinner);
        });

        angular.element($window).bind('resize', function() {
          if ($location.path() != '/') return; // only resize if we're on field page
          ctrl.field.resize();
        });

        ctrl.subscriptions.subscribe(Events.drillStateChanged, (evt, args) => {
          if (!ctrl.field) return;
          ctrl.field.drillStateChanged(args);
        });

        ctrl.subscriptions.subscribe(Events.membersAdded, () => {
          ctrl.field.membersChanged();
        });

        ctrl.subscriptions.subscribe(Events.showPaths, (evt, args) => {
          ctrl.field.showPaths();
        });

        ctrl.subscriptions.subscribe(Events.strideTypeChanged, (evt, args) => {
          ctrl.field.strideTypeChanged(args.strideType);
        });

        ctrl.subscriptions.subscribe(Events.resize, () => {
          ctrl.field.resize();
        });

        ctrl.subscriptions.subscribe(Events.sizeToFit, () => {
          ctrl.field.sizeToFit();
        });

        ctrl.subscriptions.subscribe(Events.zoomIn, () => {
          ctrl.field.zoomIn();
        });

        ctrl.subscriptions.subscribe(Events.zoomOut, () => {
          ctrl.field.zoomOut();
        });

        ctrl.subscriptions.subscribe(Events.updateField, (evt, args) => {
          ctrl.field.update();
        });
      };

      ctrl.$onDestroy = function() {
        ctrl.field.canvas.dispose();
        appStateService.field = null;
        ctrl.subscriptions.unsubscribeAll();
      };

      ctrl.$onChanges = function(changes) {
        // if the drill changed, update field
        if (!ctrl.field) return;
        ctrl.field.setDrill(ctrl.drill);
      };
    },
  });


