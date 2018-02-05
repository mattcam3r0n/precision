'use strict';

angular.module('drillApp')
.controller('LoginCtrl', function($scope, $location, userService) {
  $scope.viewName = 'login';
  // const ctrl = this; // eslint-disable-line no-invalid-this

  console.log('loginctrl');

  $scope.test = function() {
    console.log('test');
  };

  $scope.logIn = () => {
      userService.logIn($scope.email, $scope.password);
  };
});
