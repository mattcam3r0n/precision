'use strict';

angular.module('drillApp')
.controller('HelpCtrl', function($scope, $window) {
  $scope.viewName = 'Help';
  $window.addEventListener('keydown', (evt) => {
    evt.preventDefault();
    // console.log(evt);
    $scope.keyPressInfo = evt;
    $scope.$apply();
  });
});
