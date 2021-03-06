'use strict';

import Events from '/client/lib/Events';
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
        ctrl.subscriptions = eventService.createSubscriptionManager();
        eventService.notify(Events.showSpinner);
        $timeout(function() {
          ctrl.field = new FieldController(ctrl.drill, eventService);
          appStateService.field = ctrl.field;
          // it will be hidden by design controller after load is complete
          // eventService.notify(Events.hideSpinner);
          eventService.notify(Events.fieldRenderComplete);
        });

        angular.element($window).on('resize', onResize);

        ctrl.subscriptions.subscribe(Events.drillStateChanged, (evt, args) => {
          if (!ctrl.field) return;
          ctrl.field.drillStateChanged(args);
        });

        ctrl.subscriptions.subscribe(Events.membersAdded, () => {
          ctrl.field.membersChanged();
        });

        ctrl.subscriptions.subscribe(Events.membersChanged, () => {
          ctrl.field.membersChanged();
        });

        ctrl.subscriptions.subscribe(Events.showFootprints, (evt, args) => {
          ctrl.field.showFootprints(args.pointSet);
        });

        ctrl.subscriptions.subscribe(Events.clearFootprints, (evt, args) => {
          ctrl.field.clearFootprints();
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
        if (ctrl.field) {
          ctrl.field.dispose();
          ctrl.field = null;
        }
        appStateService.field = null;
        ctrl.subscriptions.unsubscribeAll();
        angular.element($window).off('resize', onResize);
      };

      ctrl.$onChanges = function(changes) {
        // if the drill changed, update field
        if (!ctrl.field) return;
        ctrl.field.setDrill(ctrl.drill);
      };

      function onResize() {
        // if ($location.path() != '/') return; // only resize if we're on field page
        ctrl.field.resize();
      }
    },
  });


