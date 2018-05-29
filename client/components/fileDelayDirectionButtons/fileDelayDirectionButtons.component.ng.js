'use strict';

angular.module('drillApp').component('fileDelayDirectionButtons', {
  templateUrl: 'client/components/fileDelayDirectionButtons/fileDelayDirectionButtons.view.ng.html',
  transclude: true,
  bindings: {
    ngModel: '=',
  },
  controller: function($scope, utilService) {
    let ctrl = this;

    ctrl.$onInit = function() {
      $('[data-toggle="tooltip"]').tooltip();
      ctrl.ngModel = 'left-to-right';
    };

    ctrl.$onDestroy = function() {
    };

    ctrl.setFileDelayDirection = function(value) {
      if (value == null) return;
      ctrl.ngModel = value;
      utilService.blurActiveElement();
    };
  },
});
