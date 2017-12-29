'use strict';

import Spinner from '/client/components/spinner/spinner';

angular.module('drillApp')
  .component('uploadMusicDialog', {
    templateUrl: 'client/design/designSurface/uploadMusicDialog/uploadMusicDialog.view.ng.html',
    bindings: {
    },
    controller: function ($rootScope, $scope, eventService, appStateService) {
      var ctrl = this;

      ctrl.activate = function() {
        $('#uploadMusicDialog').modal('show');
      }

      ctrl.deactivate = function() {
        $('#uploadMusicDialog').modal('hide');        
      }

      ctrl.isValid = function() {
        return !empty(ctrl.title) && !empty(ctrl.file);
      }

      function empty(val) {
        return val == undefined || val == null || val == '';
      }

      $scope.fileChosen = function(event){
        var files = event.target.files;
        ctrl.file = files[0];
        console.log(ctrl.file);
        $rootScope.$safeApply();
      };      

      ctrl.upload = function() {
        console.log(ctrl.file);
        let s = new Spinner($('#uploadMusicDialog')[0]);
        s.start();

        uploadFile(ctrl.file).then(url => {
          console.log('upload done', url);
          s.stop();
          ctrl.deactivate();
        }).catch(err => {
          console.log(err);
        });
      }

      ctrl.fileSize = function() {
        if (!ctrl.file) return 0;

        return ctrl.file.size / 1024 / 1024;
      }

      function uploadFile(file) {
        if (!file) return; 

        return new Promise((resolve, reject) => {
          const uploader = new Slingshot.Upload( "uploadToAmazonS3" );
          uploader.send( file, ( error, url ) => {
            if ( error ) {
              console.log('error', error);
              // Bert.alert( error.message, "warning" );
              // _setPlaceholderText();
              reject(error);
            } else {
              console.log('uploaded!', url);
              // _addUrlToDatabase( url );
              resolve(url);
            }
          });               
  
        });
      }

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


