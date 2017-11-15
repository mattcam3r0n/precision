'use strict';

import FieldController from './field/FieldController';

angular.module('drillApp')
  .component('designSurface', {
    templateUrl: 'client/design/designSurface/design-surface.view.ng.html',
    bindings: {
      drill: '<'
    },
    controller: function ($scope, $window, $timeout, appStateService, drillEditorService, eventService) {
      var ctrl = this;
      $scope.showSpinner = true;

      $timeout(function(){
        ctrl.field = new FieldController(ctrl.drill, eventService);
        $scope.showSpinner = false;
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

      var unsubscribeResize = eventService.subscribeResize(() => {
        ctrl.field.resize();
      });

      var unsubscribeShowPaths = drillEditorService.subscribeShowPaths((evt, args) => {
        ctrl.field.showPaths();        
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
      });

      
    }
  });


