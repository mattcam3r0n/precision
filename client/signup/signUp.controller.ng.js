'use strict';

import Logger from '/client/lib/Logger';

angular.module('drillApp')
  .controller('SignUpCtrl', function($scope, $location, userService, alertService) {
    $scope.viewName = 'sign-up';

    $scope.signUp = () => {
      console.log('signUp');
      userService
        .createAccount({
          email: $scope.email,
          password: $scope.password,
          profile: {
            firstName: $scope.firstName,
            lastName: $scope.lastName,
            orgName: $scope.orgName,
          },
        })
        .then(() => {
          $location.path('/');
          Meteor.callPromise('sendNewUserEmail', {
            firstName: $scope.firstName,
            lastName: $scope.lastName,
            orgName: $scope.orgName,
            email: $scope.email,
           });
        })
        .catch((ex) => {
          Logger.logException(ex);
          alertService.error('Unable to create account. ' + ex.message);
        });
    };
  });
