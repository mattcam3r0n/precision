'use strict';

import Events from '/client/lib/Events';
import FieldController from './field/FieldController';

angular.module('drillApp')
  .component('designSurface', {
    templateUrl: 'client/design/designSurface/design-surface.view.ng.html',
    bindings: {
      drill: '<'
    },
    controller: function ($scope, $window, $timeout, appStateService, drillEditorService, eventService) {
      var ctrl = this;
      eventService.notify(Events.showSpinner);

      $timeout(function(){
        ctrl.field = new FieldController(ctrl.drill, eventService);
        eventService.notifyHideSpinner();
      });

      ctrl.$onChanges = function(changes) {
        // if the drill changed, update field
        if (!ctrl.field) return;
        ctrl.field.setDrill(ctrl.drill);
      }

      angular.element($window).bind('resize', function () {
        ctrl.field.resize();
      });

      var unsubscribeDrillStateChanged = drillEditorService.subscribeDrillStateChanged((evt, args) => {
        if (!ctrl.field) return;
        ctrl.field.drillStateChanged(args);
      });

      var unsubscribeMembersAdded = drillEditorService.subscribeMembersAdded(() => {
        ctrl.field.membersChanged();        
      });

      var unsubscribeShowPaths = drillEditorService.subscribeShowPaths((evt, args) => {
        ctrl.field.showPaths();        
      });

      var unsubscribeStrideTypeChanged = drillEditorService.subscribeStrideTypeChanged((evt, args) => {
        //ctrl.field.showPaths();        
        ctrl.field.strideTypeChanged(args.strideType);
      });

      var unsubscribeResize = eventService.subscribeResize(() => {
        ctrl.field.resize();
      });

      var unsubscribeSizeToFit = eventService.subscribeSizeToFit(() => {
        ctrl.field.sizeToFit();
      });

      var unsubscribeZoomIn = eventService.subscribeZoomIn(() => {
        ctrl.field.zoomIn();
      });

      var unsubscribeZoomOut = eventService.subscribeZoomOut(() => {
        ctrl.field.zoomOut();
      });

      var unsubscribeUpdateField = eventService.subscribeUpdateField((evt, args) => {
        ctrl.field.update();
      });

      $scope.$on("$destroy", function(){
        ctrl.field.canvas.dispose();
        unsubscribeDrillStateChanged();
        unsubscribeMembersAdded();
        unsubscribeShowPaths();
        unsubscribeUpdateField();
        unsubscribeStrideTypeChanged();
        unsubscribeResize();
        unsubscribeSizeToFit();
        unsubscribeZoomIn();
        unsubscribeZoomOut();
      });

      
    }
  });


