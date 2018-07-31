'use strict';

angular.module('drillApp').component('spinnerBox', {
  templateUrl: 'client/components/spinnerBox/spinnerBox.view.ng.html',
  transclude: true,
  bindings: {
    ngModel: '=',
    ngChange: '&',
  },
  controller: function($scope, $rootScope) {
    let ctrl = this;

    ctrl.$onInit = function() {
      ctrl.ngModel = 0;
    };

    ctrl.$onChanges = function() {
    };

    ctrl.$onDestroy = function() {
    };

    ctrl.setValue = function(value) {
      // ctrl.value = value;
      ctrl.ngModel = value;
      $rootScope.$safeApply();
      if (ctrl.ngChange) {
        ctrl.ngChange({ fileDelay: value });
      }
    };
  },
});
