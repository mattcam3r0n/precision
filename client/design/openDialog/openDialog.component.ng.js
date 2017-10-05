'use strict';

angular.module('drillApp')
  .component('openDialog', {
    templateUrl: 'client/design/openDialog/openDialog.view.ng.html',
    bindings: {
      onOpen: "&"
    },
    controller: function ($scope, $window, $timeout, $rootScope, appStateService) {
      var ctrl = this;

      $scope.page = 1;
      $scope.perPage = 3;
      $scope.sort = {}; //{ name_sort: 1 };
      $scope.orderProperty = '1';

      $scope.subscribe('drills', function () {
        return [{
          sort: $scope.getReactively('sort'),
          limit: parseInt($scope.getReactively('perPage')),
          skip: ((parseInt($scope.getReactively('page'))) - 1) * (parseInt($scope.getReactively('perPage')))
        }, $scope.getReactively('search')];
      });
          
      $scope.helpers({
        drillCount: function () {
          return Counts.get('numberOfDrills');
        },
        drills: function () {
          return Drills.find({}, {
            sort: $scope.getReactively('sort')
          });
        }
      });

      $scope.open = function(drill) {
        console.log('open', drill);
        ctrl.onOpen({ drill: drill });
      }

      $scope.pageChanged = function (newPage) {
        $scope.page = newPage;
      };

      return $scope.$watch('orderProperty', function () {
        if ($scope.orderProperty) {
          $scope.sort = {
            name_sort: parseInt($scope.orderProperty)
          };
        }
      });

      ctrl.$onInit = function () {
        console.log('opendialog init');
      }

      ctrl.$onDestroy = function () {
      }
    }
  });


