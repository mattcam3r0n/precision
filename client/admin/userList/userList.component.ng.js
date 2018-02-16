'use strict';

import { Meteor } from 'meteor/meteor';
import Events from '/client/lib/Events';

angular.module('drillApp')
  .component('userList', {
    templateUrl: 'client/admin/userList/userList.view.ng.html',
    bindings: {
    },
    controller: function($scope, eventService) {
      let ctrl = this;

      $scope.page = 1;
      $scope.perPage = 3;
      $scope.sort = {}; // { name_sort: 1 };
      $scope.orderProperty = '1';

      $scope.subscribe('users', function() {
        return [{
          sort: $scope.getReactively('sort'),
          limit: parseInt($scope.getReactively('perPage')),
          skip: ((parseInt($scope.getReactively('page'))) - 1)
            * (parseInt($scope.getReactively('perPage'))),
        }, $scope.getReactively('search')];
      });

      $scope.helpers({
        users: function() {
          return Meteor.users.find({}, {
            sort: $scope.getReactively('sort'),
          });
        },
      });

      $scope.selectUser = function(user) {
        ctrl.user = user;
        eventService.notify(Events.userSelected, { user: user });
      };

      $scope.pageChanged = function(newPage) {
        $scope.page = newPage;
      };

      ctrl.$onInit = function() {
      };

      ctrl.$onDestroy = function() {
      };
    },
  });


