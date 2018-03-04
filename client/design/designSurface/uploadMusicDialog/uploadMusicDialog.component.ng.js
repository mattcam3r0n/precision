'use strict';

import Logger from '/client/lib/Logger';
import Events from '/client/lib/Events';
import Spinner from '/client/components/spinner/spinner';
import FileUploader from '/lib/FileUploader';

angular.module('drillApp')
  .component('uploadMusicDialog', {
    templateUrl: 'client/design/designSurface/uploadMusicDialog/uploadMusicDialog.view.ng.html',
    bindings: {
    },
    controller: function($rootScope, $scope, eventService, appStateService) {
      let ctrl = this;

      ctrl.activate = function() {
        $('#uploadMusicDialog').modal('show');
        ctrl.file = null;
      };

      ctrl.deactivate = function() {
        $('#uploadMusicDialog').modal('hide');
      };

      ctrl.isValid = function() {
        return !empty(ctrl.title) && !empty(ctrl.file) && ctrl.licenseConfirmed;
      };

      function empty(val) {
        return val == undefined || val == null || val == '';
      }

      $scope.fileChosen = function(event) {
        let files = event.target.files;
        ctrl.file = files[0];
        console.log(ctrl.file);
        $rootScope.$safeApply();
      };

      ctrl.upload = function() {
        console.log(ctrl.file);
        let spinner = new Spinner($('#uploadMusicDialog')[0]);
        spinner.start();

        FileUploader.upload(ctrl.file)
        .then((url) => {
          saveFile(ctrl.file, url);
          spinner.stop();
          Bert.alert('File uploaded successfully.', 'success', 'growl-top-right');
          ctrl.deactivate();
        })
        .catch((err) => {
          let msg = 'Unable to upload file.';
          Logger.error(msg, {
            file: ctrl.file.name,
            error: err,
          });
          spinner.stop();
        });
      };

      function saveFile(file, url) {
        let musicFile = {
          type: 'file',
          fileName: file.name,
          key: FileUploader.key(file),
          url: url,
          title: ctrl.title,
          notes: ctrl.notes,
          composedBy: ctrl.composedBy,
          performedBy: ctrl.performedBy,
          isPublic: ctrl.isPublic || false,
        };

        appStateService.saveClip(musicFile);
      }

      ctrl.fileSize = function() {
        if (!ctrl.file) return 0;

        return ctrl.file.size / 1024 / 1024;
      };

      ctrl.$onInit = function() {
        ctrl.subscriptions = eventService.createSubscriptionManager();
        ctrl.subscriptions.subscribe(Events.uploadMusicDialogActivated,
          (evt, args) => {
            ctrl.activate();
          });
      };

      ctrl.$onDestroy = function() {
        ctrl.subscriptions.unsubscribeAll();
      };
    },
  });


