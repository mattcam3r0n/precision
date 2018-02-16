'use strict';


angular.module('drillApp')
  .component('userMenu', {
    templateUrl: 'client/components/userMenu/userMenu.component.ng.html',
    bindings: {
    },
    controller: function($scope,
              $location,
              userService
            ) {
      let ctrl = this;

      ctrl.$onInit = function() {
      };

      ctrl.$onChanges = function(changes) {
      };

      ctrl.$onDestroy = function() {
      };

      ctrl.isLoggedIn = function() {
        return userService.isLoggedIn();
      };

      ctrl.userName = function() {
        return userService.getUserEmail();
      };

      ctrl.logOut = function() {
        userService.logOut();
        $location.path('/login');
      };
    },
  });
