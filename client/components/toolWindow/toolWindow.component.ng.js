'use strict';

angular.module('drillApp').component('toolWindow', {
  // eslint-disable-next-line max-len
  templateUrl: 'client/components/toolWindow/toolWindow.view.ng.html',
  transclude: true,
  bindings: {
    isActivated: '<',
    windowTitle: '<',
    onSave: '&',
    onCancel: '&',
  },
  controller: function($scope, $window) {
    let ctrl = this;

    ctrl.$onInit = function() {
      $('[data-toggle="tooltip"]').tooltip();
    };

    ctrl.$onDestroy = function() {};

    $scope.save = function() {
      save();
    };

    $scope.cancel = function() {
      cancel();
    };

    function save() {
      if (ctrl.onSave) {
        ctrl.onSave();
      }
    }

    function cancel() {
      if (ctrl.onCancel) {
        ctrl.onCancel();
      }
    }
  },
});
