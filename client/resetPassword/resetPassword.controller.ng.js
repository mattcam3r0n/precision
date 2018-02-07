'use strict';

angular.module('drillApp')
.controller('ResetPasswordCtrl', function($scope, $location, userService) {
  $scope.viewName = 'resetPassword';
  // const ctrl = this; // eslint-disable-line no-invalid-this

  /* TODO
    * hide form and show "email sent" message
    * if reset token is present in url, show change password form
  */
  $scope.forgotPassword = () => {
      userService.forgotPassword($scope.email);
  };
});
