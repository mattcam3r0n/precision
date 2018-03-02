'use strict';

import { Meteor } from 'meteor/meteor';
import Events from '/client/lib/Events';

angular.module('drillApp')
  .component('userList', {
    templateUrl: 'client/admin/userList/userList.view.ng.html',
    bindings: {
        pageSize: '<',
        enableMultiSelect: '<',
        selectedUsers: '<',
        onSelected: '&',
    },
    controller: function($scope, eventService) {
      let ctrl = this;

      $scope.page = 1;
      $scope.perPage = ctrl.pageSize || 10;
      $scope.sort = {}; // { name_sort: 1 };
      $scope.orderProperty = '1';

//      ctrl.selected = [];
      ctrl.selectedUsers = ctrl.selectedUsers || [];

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
        userCount: function() {
          return Counts.get('numberOfUsers');
        },
      });

      $scope.selectUser = function(user) {
        ctrl.user = user;

        if (ctrl.enableMultiSelect) {
          if (ctrl.isSelected(user)) {
            ctrl.selectedUsers = ctrl.selectedUsers
                                    .filter((u) => u._id !== user._id);
          } else {
            ctrl.selectedUsers.push(user);
          }
        }

        if (ctrl.onSelected) {
          ctrl.onSelected({ user: user, selected: ctrl.selectedUsers });
        }
        eventService.notify(Events.userSelected, { user: user });
      };

      $scope.pageChanged = function(newPage) {
        $scope.page = newPage;
      };

      ctrl.isSelected = function(user) {
        if (!ctrl.selectedUsers) return;
        return ctrl.selectedUsers.filter((u) => u._id == user._id).length > 0;
      };

      ctrl.$onInit = function() {
      };

      ctrl.$onDestroy = function() {
      };
    },
  });


