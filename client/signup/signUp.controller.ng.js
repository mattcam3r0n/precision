'use strict';

import Logger from '/client/lib/Logger';

angular.module('drillApp')
  .controller('SignUpCtrl', function($scope, $location, userService, alertService) {
    $scope.viewName = 'sign-up';

    $scope.signUp = () => {
      const info = {
        email: $scope.email,
        password: $scope.password,
        profile: {
          firstName: $scope.firstName,
          lastName: $scope.lastName,
          orgName: $scope.orgName,
        },
      };
      userService
        .createAccount(info)
        .then(() => {
          $location.path('/');
        })
        .catch((ex) => {
          console.log(ex);
          Logger.logException(ex);
          alertService.error('Unable to create account. ' + ex.message);
        });
    };
  });
