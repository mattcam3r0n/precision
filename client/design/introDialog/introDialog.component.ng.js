'use strict';

import Events from '/client/lib/Events';

angular.module('drillApp')
  .component('introDialog', {
    templateUrl: 'client/design/introDialog/introDialog.view.ng.html',
    bindings: {
    },
    controller: function($scope, $rootScope, $timeout, appStateService,
      eventService, confirmationDialogService) {
      let ctrl = this;

      ctrl.$onInit = function() {
        ctrl.subscriptions = eventService.createSubscriptionManager();

        ctrl.subscriptions.subscribe(Events.showIntroDialog,
          ctrl.activate.bind(this));

        $('#introDialog').on('hidden.bs.modal', onHidden);

        ctrl.slides = [
          {
            title: 'Add Marchers',
            img: '/intro/add-marchers.gif',
          },
          {
            title: 'Select Marchers',
            video: '/intro/select-marchers.webm',
          },
          {
            title: 'Add Steps',
            img: '/intro/add-steps.gif',
          },
          {
            title: 'Clear Counts',
            video: '/intro/clear-count.webm',
          },
          {
            title: 'Delete Counts',
            video: '/intro/delete-count.webm',
          },
          {
            title: 'Delete Forward',
            video: '/intro/delete-forward.webm',
          },
          {
            title: 'Draw Paths',
            img: '/intro/paths-column.gif',
          },
          {
            title: 'Add Music',
            video: '/intro/music-intro.webm',
          },
        ];
      };

      ctrl.$onDestroy = function() {
        ctrl.subscriptions.unsubscribeAll();
        $('#introDialog').off('hidden.bs.modal');
      };

      ctrl.activate = function() {
        ctrl.slideIndex = 0;
        ctrl.current = ctrl.slides[ctrl.slideIndex];
        $('#introDialog').modal('show');
      };

      ctrl.next = function() {
        ctrl.slideIndex++;
        if (ctrl.slideIndex > ctrl.slides.length - 1) {
          ctrl.slideIndex = 0;
        }
        ctrl.current = ctrl.slides[ctrl.slideIndex];
        clearVideo();
      };

      ctrl.previous = function() {
        ctrl.slideIndex--;
        if (ctrl.slideIndex < 0) {
          ctrl.slideIndex = ctrl.slides.length - 1;
        }
        ctrl.current = ctrl.slides[ctrl.slideIndex];
        clearVideo();
      };

      function onHidden() {
        clearVideo();
      }

      function clearVideo() {
        $('video').attr('src', '');
      }
    },
  });


