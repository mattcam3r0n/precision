'use strict';

import Logger from '/client/lib/Logger';

angular.module('drillApp')
.controller('ForgotPasswordCtrl', function($scope, $stateParams, $location, userService) {
  $scope.viewName = 'forgotPassword';
  // const ctrl = this; // eslint-disable-line no-invalid-this

  $scope.showSentMessage = false;
  $scope.showErrorMessage = false;
  $scope.message = null;

  /* TODO
    * hide form and show "email sent" message
    * if reset token is present in url, show change password form
  */
  $scope.forgotPassword = () => {
    // TODO: validate email
    userService
      .forgotPassword($scope.email)
      .then(() => {
      })
      .catch((ex) => {
        Logger.error('Error in forgotPassword', ex);
      });
    $scope.showSentMessage = true;
  };

  $scope.setNewPassword = () => {
    const token = $stateParams.resetToken;
    const pwd = $scope.password;
    userService.resetPassword(token, pwd)
    .then(() => {
      $location.path('/');
    })
    .catch((ex) => {
      $scope.message = ex.inner.message;
      $scope.showErrorMessage = true;
      Logger.error('Error in setNewPassword', ex);
    });
  };

  $scope.hasResetToken = () => {
    return $stateParams.resetToken;
  };
});
