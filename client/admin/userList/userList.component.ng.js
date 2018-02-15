'use strict';

import { Meteor } from 'meteor/meteor';
import Events from '/client/lib/Events';

angular.module('drillApp')
  .component('userList', {
    templateUrl: 'client/admin/userList/userList.view.ng.html',
    bindings: {
    },
    controller: function($scope, appStateService, eventService) {
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

      $scope.open = function(drill) {
        ctrl.onOpen({ drill: drill });
        eventService.notify(Events.drillOpened, {
          drill: drill,
        });
      };

      $scope.delete = function(drill) {
        appStateService.deleteDrill(drill._id);
      };

      $scope.pageChanged = function(newPage) {
        $scope.page = newPage;
      };

      return $scope.$watch('orderProperty', function() {
        if ($scope.orderProperty) {
          $scope.sort = {
            name_sort: parseInt($scope.orderProperty),
          };
        }
      });

      ctrl.$onInit = function() {
      };

      ctrl.$onDestroy = function() {
      };
    },
  });


