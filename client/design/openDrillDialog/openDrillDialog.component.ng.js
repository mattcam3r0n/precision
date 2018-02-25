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

      $scope.searchOptions = { searchText: '', searchMyDrills: true, searchSharedDrills: false };
      $scope.page = 1;
      $scope.perPage = 5;
      $scope.sort = {}; // { name_sort: 1 };
      $scope.orderProperty = '1';

      $scope.subscribe('drills', function() {
        return [{
          sort: $scope.getReactively('sort'),
          limit: parseInt($scope.getReactively('perPage')),
          skip: ((parseInt($scope.getReactively('page'))) - 1)
            * (parseInt($scope.getReactively('perPage'))),
        },
          $scope.getReactively('searchOptions.searchText'),
          $scope.getReactively('searchOptions.searchMyDrills'),
          $scope.getReactively('searchOptions.searchSharedDrills'),
        ];
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

      $scope.open = function(selectedDrill) {
        eventService.notify(Events.showSpinner);
        appStateService.openDrill(selectedDrill._id).then((drill) => {
          ctrl.onOpen({ drill: drill });
          eventService.notify(Events.drillOpened, {
            drill: drill,
          });
          eventService.notify(Events.hideSpinner);
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

      $scope.canDelete = function(drill) {
        return $scope.currentUser && drill && (drill.userId === $scope.currentUser._id);
      };

      $scope.pageChanged = function(newPage) {
        $scope.page = newPage;
      };

      const unwatchOrderProperty = $scope.$watch('orderProperty', function() {
        if ($scope.orderProperty) {
          $scope.sort = {
            name_sort: parseInt($scope.orderProperty),
          };
        }
      });

      const unwatchSharedDrills = $scope.$watch('searchOptions.searchSharedDrills',
        function(newValue, oldValue) {
          if (!$scope.searchOptions.searchSharedDrills
              && !$scope.searchOptions.searchMyDrills) {
            $scope.searchOptions.searchMyDrills = true;
          }
      });

      ctrl.$onInit = function() {
      };

      ctrl.$onDestroy = function() {
        unwatchOrderProperty();
        unwatchSharedDrills();
      };
    },
  });


