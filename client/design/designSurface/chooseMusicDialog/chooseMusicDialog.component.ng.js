'use strict';

import Events from '/client/lib/Events';

angular.module('drillApp').component('chooseMusicDialog', {
  templateUrl:
    'client/design/designSurface/chooseMusicDialog/chooseMusicDialog.view.ng.html',
  bindings: {},
  controller: function($scope, eventService, appStateService) {
    let ctrl = this;

    $scope.searchOptions = {
      searchText: '',
      searchFiles: true,
      searchClips: true,
      searchNammb: false,
    };
    $scope.page = 1;
    $scope.perPage = 6;
    $scope.sort = { title: 1 }; // { name_sort: 1 };
    $scope.orderProperty = '1';

    $scope.subscribe('musicFiles', function() {
      return [
        {
          sort: $scope.getReactively('sort'),
          limit: parseInt($scope.getReactively('perPage')),
          skip:
            (parseInt($scope.getReactively('page')) - 1) *
            parseInt($scope.getReactively('perPage')),
        },
        $scope.getReactively('searchOptions.searchText'),
        $scope.getReactively('searchOptions.searchFiles'),
        $scope.getReactively('searchOptions.searchClips'),
        $scope.getReactively('searchOptions.searchNammb'),
      ];
    });

    $scope.helpers({
      musicFileCount: function() {
        return Counts.get('numberOfMusicFiles');
      },
      musicFiles: function() {
        return MusicFiles.find(
          {},
          {
            sort: $scope.getReactively('sort'),
          }
        );
      },
    });

    ctrl.activate = function() {
      $('#chooseMusicDialog').modal('show');
      $scope.page = 1;
    };

    ctrl.open = function(musicFile) {
      $('#chooseMusicDialog').modal('hide');
      eventService.notify(Events.audioClipDialogActivated, { musicFile });
    };

    ctrl.setActiveTab = function(tab) {
      ctrl.activeTab = tab;
      $scope.searchOptions.searchNammb = (tab == 'nammbMusic');
    };

    ctrl.isTabActive = function(tab) {
      return ctrl.activeTab == tab;
    };

    ctrl.isFile = function(musicFile) {
      return musicFile.type == 'file';
    };

    ctrl.isClip = function(musicFile) {
      return musicFile.type == 'clip';
    };

    ctrl.isUserLoggedIn = function() {
      return $scope.currentUser;
    };

    ctrl.getDuration = function(musicFile) {
      return musicFile.duration || 0;
    };

    ctrl.$onInit = function() {
      ctrl.subscriptions = eventService.createSubscriptionManager();
      ctrl.subscriptions.subscribe(
        Events.chooseMusicDialogActivated,
        (evt, args) => {
          ctrl.activate();
        }
      );
      ctrl.activeTab = 'myMusic';
    };

    ctrl.$onDestroy = function() {
      ctrl.subscriptions.unsubscribeAll();
    };

    $scope.pageChanged = function(newPage) {
      $scope.page = newPage;
    };

    $scope.upload = function() {
      eventService.notify(Events.uploadMusicDialogActivated);
    };
  },
});
