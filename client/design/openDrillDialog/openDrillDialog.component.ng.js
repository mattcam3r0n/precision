'use strict';

import Events from '/client/lib/Events';

angular.module('drillApp')
  .component('openDrillDialog', {
    templateUrl: 'client/design/openDrillDialog/openDrillDialog.view.ng.html',
    bindings: {
      onOpen: '&',
    },
    controller: function($scope, appStateService,
        eventService, confirmationDialogService) {
      let ctrl = this;

      $scope.page = 1;
      $scope.perPage = 7;
      $scope.sort = {}; // { name_sort: 1 };
      $scope.orderProperty = '1';

      $scope.subscribe('drills', function() {
        return [{
          sort: $scope.getReactively('sort'),
          limit: parseInt($scope.getReactively('perPage')),
          skip: ((parseInt($scope.getReactively('page'))) - 1)
            * (parseInt($scope.getReactively('perPage'))),
        }, $scope.getReactively('search')];
      });

      $scope.helpers({
        drillCount: function() {
          return Counts.get('numberOfDrills');
        },
        drills: function() {
          return Drills.find({}, {
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
        confirmationDialogService.show({
          heading: 'Delete Drill',
          message: 'Are you sure you want delete "' + drill.name + '"?',
          confirmText: 'Delete',
        }).then((result) => {
          if (result.confirmed) {
            appStateService.deleteDrill(drill._id);
          }
        });
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


