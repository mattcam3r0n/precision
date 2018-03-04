'use strict';

angular.module('drillApp')
.controller('ChangePasswordCtrl', function($scope, $location, userService) {
  $scope.viewName = 'changePassword';
  $scope.errorMessage = null;
  // const ctrl = this; // eslint-disable-line no-invalid-this

  /* TODO
    * hide form and show "email sent" message
    * if reset token is present in url, show change password form
  */
  $scope.changePassword = () => {
    console.log($scope.currentPassword, $scope.newPassword);
      userService
        .changePassword($scope.currentPassword, $scope.newPassword)
        .then(() => {
          $scope.errorMessage = null;
          $location.path('/');
          $scope.$apply(); // for some reason path won't change unless apply is called
        })
        .catch((ex) => {
          $scope.errorMessage = ex.inner.message;
          $scope.$apply();
        });
  };
});
