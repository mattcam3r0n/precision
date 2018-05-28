'use strict';

angular.module('drillApp').component('spinnerBox', {
  templateUrl: 'client/components/spinnerBox/spinnerBox.view.ng.html',
  transclude: true,
  bindings: {
    ngModel: '=',
  },
  controller: function($scope) {
    let ctrl = this;

    ctrl.$onInit = function() {
      ctrl.value = 0;
    };

    ctrl.$onDestroy = function() {
    };

    ctrl.setValue = function(value) {
      if (value == null) return;
      ctrl.value = value;
      ctrl.ngModel = value;
    };
  },
});
