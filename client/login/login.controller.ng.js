'use strict';

angular.module('drillApp')
.controller('LoginCtrl', function($scope, $location, userService) {
  $scope.viewName = 'login';
  $scope.message = '';

  $scope.logIn = () => {
      userService
        .logIn($scope.email, $scope.password)
        .then(() => {
          $location.path('/');
        })
        .catch((ex) => {
          $scope.message = ex.inner.reason;
        });
  };
});
