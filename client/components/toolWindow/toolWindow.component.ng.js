'use strict';

angular.module('drillApp').component('toolWindow', {
  // eslint-disable-next-line max-len
  templateUrl:
    'client/components/toolWindow/toolWindow.view.ng.html',
  transclude: true,
  bindings: {
    isActivated: '<',
    windowTitle: '<',
    onSave: '&',
    onCancel: '&',
  },
  controller: function(
    $scope,
    $window,
    appStateService,
    drillEditorService,
    alertService,
    eventService
  ) {
    let ctrl = this;

    ctrl.$onInit = function() {
      ctrl.subscriptions = eventService.createSubscriptionManager();
    };

    ctrl.$onDestroy = function() {
      ctrl.subscriptions.unsubscribeAll();
    };

    $scope.save = function() {
      save();
      deactivate();
    };

    $scope.cancel = function() {
      cancel();
      deactivate();
    };

    function activate(memberSelection, turnDirection) {
      if (ctrl.isActivated) {
        deactivate();
      }

      appStateService.setActiveTool('columnTool', () => {
        deactivate(false);
      });

      // ctrl.isActivated = true;
    }

    function deactivate(notify = true) {
      // ctrl.isActivated = false;
      if (notify) {
      }
    }

    function save() {
      if (ctrl.onSave) {
        ctrl.onSave();
      }
    }

    function cancel() {
      if (ctrl.onCancel){
        ctrl.onCancel();
      }
    }
  },
});
