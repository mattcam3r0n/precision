'use strict';

import Events from '/client/lib/Events';

angular.module('drillApp').component('openDrillDialog', {
  templateUrl: 'client/design/openDrillDialog/openDrillDialog.view.ng.html',
  bindings: {
    onOpen: '&',
  },
  controller: function(
    $scope,
    $rootScope,
    appStateService,
    eventService,
    confirmationDialogService
  ) {
    let ctrl = this;

    $scope.searchOptions = {
      searchText: '',
      searchMyDrills: true,
      searchSharedDrills: false,
    };
    $scope.searchText = '';
    $scope.page = 1;
    $scope.perPage = 5;
    $scope.sort = {}; // { name_sort: 1 };
    $scope.orderProperty = '1';

    $scope.subscribe('drills', function() {
      return [
        {
          sort: $scope.getReactively('sort'),
          limit: parseInt($scope.getReactively('perPage')),
          skip:
            (parseInt($scope.getReactively('page')) - 1) *
            parseInt($scope.getReactively('perPage')),
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
        return Drills.find(
          {},
          {
            sort: $scope.getReactively('sort'),
          }
        );
      },
    });

    $scope.setSearchText = _.debounce(() => {
      console.log('debounced setSearchText', $scope.searchText);
      $scope.searchOptions.searchText = $scope.searchText;
      $rootScope.$safeApply();
    }, 500, false);

    $scope.open = function(selectedDrill) {
      eventService.notify(Events.showSpinner);
      appStateService.openDrill(selectedDrill._id).then((drill) => {
        eventService.notify(Events.hideSpinner);
      });
    };

    $scope.delete = function(drill) {
      const msg =
        'Are you sure you want delete "' +
        drill.name +
        '"?' +
        ($scope.isCurrentDrill(drill)
          ? ' This drill is currently open.  If you choose to delete it, a new drill will be opened.'
          : '');
      confirmationDialogService
        .show({
          heading: 'Delete Drill',
          message: msg,
          confirmText: 'Delete',
        })
        .then((result) => {
          if (result.confirmed) {
            appStateService.deleteDrill(drill._id);
            // if ($scope.isCurrentDrill(drill)) {
            //   appStateService.newDrill();
            // }
            eventService.notify(Events.drillDeleted);
          }
        });
    };

    $scope.isCurrentDrill = function(drill) {
      const currentDrillId = appStateService.drill
        ? appStateService.drill._id
        : null;
      return drill._id == currentDrillId;
    };

    $scope.canDelete = function(drill) {
      return (
        $scope.currentUser &&
        drill &&
        drill.userId === $scope.currentUser._id &&
        !$scope.isCurrentDrill(drill)
      );
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

    const unwatchSharedDrills = $scope.$watch(
      'searchOptions.searchSharedDrills',
      function(newValue, oldValue) {
        if (
          !$scope.searchOptions.searchSharedDrills &&
          !$scope.searchOptions.searchMyDrills
        ) {
          $scope.searchOptions.searchMyDrills = true;
        }
      }
    );

    ctrl.$onInit = function() {};

    ctrl.$onDestroy = function() {
      unwatchOrderProperty();
      unwatchSharedDrills();
    };
  },
});
