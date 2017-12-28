'use strict';

angular.module('drillApp')
  .component('uploadMusicDialog', {
    templateUrl: 'client/design/designSurface/uploadMusicDialog/uploadMusicDialog.view.ng.html',
    bindings: {
    },
    controller: function ($scope, eventService, appStateService) {
      var ctrl = this;

      $scope.searchOptions = { searchText: '', searchFiles: true, searchClips: true };
      $scope.page = 1;
      $scope.perPage = 6;
      $scope.sort = {}; //{ name_sort: 1 };
      $scope.orderProperty = '1';

      $scope.subscribe('musicFiles', function () {
        return [{
          sort: $scope.getReactively('sort'),
          limit: parseInt($scope.getReactively('perPage')),
          skip: ((parseInt($scope.getReactively('page'))) - 1) * (parseInt($scope.getReactively('perPage')))
        }, 
        $scope.getReactively('searchOptions.searchText'),
        $scope.getReactively('searchOptions.searchFiles'),
        $scope.getReactively('searchOptions.searchClips')
        ];
      });

      // $scope.$watch('searchOptions', function() {
      //   console.log($scope.searchOptions);
      // });
      
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
        $('#uploadMusicDialog').modal('show');
        $scope.page = 1;
      }

      $scope.uploadFile = function(event){
        var files = event.target.files;
        console.log(files);

        const uploader = new Slingshot.Upload( "uploadToAmazonS3" );
        uploader.send( files[0], ( error, url ) => {
          if ( error ) {
            console.log('error', error);
            // Bert.alert( error.message, "warning" );
            // _setPlaceholderText();
          } else {
            console.log('uploaded!', url);
            // _addUrlToDatabase( url );
          }
        });               
      };      

      ctrl.$onInit = function () {
        ctrl.unsubscribeUploadMusicDialogActivated = eventService.subscribeUploadMusicDialogActivated((evt, args) => {
          ctrl.activate();
        });
      }

      ctrl.$onDestroy = function () {
        ctrl.unsubscribeUploadMusicDialogActivated();
      }

    }
  });


