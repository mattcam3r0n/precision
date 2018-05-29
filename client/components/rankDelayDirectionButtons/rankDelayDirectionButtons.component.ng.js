'use strict';

angular.module('drillApp').component('rankDelayDirectionButtons', {
  templateUrl: 'client/components/rankDelayDirectionButtons/rankDelayDirectionButtons.view.ng.html',
  transclude: true,
  bindings: {
    ngModel: '=',
  },
  controller: function($scope, utilService) {
    let ctrl = this;

    ctrl.$onInit = function() {
      $('[data-toggle="tooltip"]').tooltip();
      ctrl.ngModel = 'front-to-back';
    };

    ctrl.$onDestroy = function() {
    };

    ctrl.setRankDelayDirection = function(value) {
      if (value == null) return;
      ctrl.ngModel = value;
      utilService.blurActiveElement();
    };
  },
});
