'use strict';

angular.module('drillApp')
  .component('chooseMusicDialog', {
    templateUrl: 'client/design/designSurface/chooseMusicDialog/chooseMusicDialog.view.ng.html',
    bindings: {
    },
    controller: function ($scope, eventService, appStateService) {
      var ctrl = this;

      $scope.page = 1;
      $scope.perPage = 8;
      $scope.sort = {}; //{ name_sort: 1 };
      $scope.orderProperty = '1';

      $scope.subscribe('musicFiles', function () {
        return [{
          sort: $scope.getReactively('sort'),
          limit: parseInt($scope.getReactively('perPage')),
          skip: ((parseInt($scope.getReactively('page'))) - 1) * (parseInt($scope.getReactively('perPage')))
        }, $scope.getReactively('searchText')];
      });

      $scope.helpers({
        musicFileCount: function () {
          return Counts.get('numberOfMusicFiles');
        },
        musicFiles: function () {
          return MusicFiles.find({}, {
            sort: $scope.getReactively('sort')
          });
        }
      });

      ctrl.activate = function() {
        $('#chooseMusicDialog').modal('show');
      }

      ctrl.open = function(musicFile) {
        $('#chooseMusicDialog').modal('hide');
        eventService.notifyAudioClipDialogActivated({ musicFile });
      }

      ctrl.$onInit = function () {
        ctrl.unsubscribeChooseMusicDialogActivated = eventService.subscribeChooseMusicDialogActivated((evt, args) => {
          ctrl.activate();
        });
      }

      ctrl.$onDestroy = function () {
        ctrl.unsubscribeChooseMusicDialogActivated();
      }


    }
  });


