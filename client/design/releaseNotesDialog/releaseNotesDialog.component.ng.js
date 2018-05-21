'use strict';

import Events from '/client/lib/Events';
import marked from 'marked';

angular.module('drillApp')
  .component('releaseNotesDialog', {
    templateUrl: 'client/design/releaseNotesDialog/releaseNotesDialog.view.ng.html',
    bindings: {
    },
    controller: function($scope, $rootScope, $timeout, appStateService,
      eventService, confirmationDialogService) {
      let ctrl = this;

      ctrl.$onInit = function() {
        ctrl.subscriptions = eventService.createSubscriptionManager();

        ctrl.subscriptions.subscribe(Events.showReleaseNotesDialog,
          ctrl.activate.bind(this));

        $('#releaseNotesDialog').on('hidden.bs.modal', onHidden);
      };

      ctrl.$onDestroy = function() {
        ctrl.subscriptions.unsubscribeAll();
        $('#releaseNotesDialog').off('hidden.bs.modal');
      };

      ctrl.activate = function() {
        fetch('release-notes.md')
        .then(function(response) {
          return response.text();
        })
        .then(function(markdown) {
          const div = angular.element( document.querySelector( '#releaseNotes' ) );
          // div.append(marked(markdown));
          div.html(marked(markdown));
        });

        $('#releaseNotesDialog').modal('show');
      };

      function onHidden() {
      }
    },
  });


