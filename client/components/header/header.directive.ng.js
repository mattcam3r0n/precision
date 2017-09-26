'use strict'

angular.module('drillApp')
.directive('header', function() {
  return {
    restrict: 'AE',
    templateUrl: 'client/components/header/header.view.ng.html',
    replace: true
  };
});