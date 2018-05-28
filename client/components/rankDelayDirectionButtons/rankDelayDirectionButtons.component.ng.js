'use strict';

angular.module('drillApp').component('rankDelayDirectionButtons', {
  templateUrl: 'client/components/rankDelayDirectionButtons/rankDelayDirectionButtons.view.ng.html',
  transclude: true,
  bindings: {
    ngModel: '=',
  },
  controller: function($scope) {
    let ctrl = this;

    ctrl.$onInit = function() {
      $('[data-toggle="tooltip"]').tooltip();
      ctrl.rankDelayDirection = 'front-to-back';
    };

    ctrl.$onDestroy = function() {
    };

    ctrl.setRankDelayDirection = function(value) {
      if (value == null) return;
      ctrl.rankDelayDirection = value;
      ctrl.ngModel = value;
    };
  },
});
