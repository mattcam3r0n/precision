'use strict';

import { Meteor } from 'meteor/meteor';

angular.module('drillApp')
.controller('LoginCtrl', function($scope, $location) {
  $scope.viewName = 'login';
  // const ctrl = this; // eslint-disable-line no-invalid-this

  console.log('loginctrl');

  $scope.test = function() {
    console.log('test');
  };

  $scope.logIn = () => {
    console.log('log in');
    Meteor.loginWithPassword($scope.email, $scope.password, function(err) {
      if (err) {
        // The user might not have been found, or their passwword
        // could be incorrect. Inform the user that their
        // login attempt has failed.
        console.log(err);
      } else {
        console.log('logged in');
        $location.path('/');
      }
        // The user has been logged in.
    });
  };
});
