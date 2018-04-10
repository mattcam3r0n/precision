'use strict';

// import Events from '/client/lib/Events';

angular.module('drillApp')
  .component('bookmarkList', {
    templateUrl: 'client/design/designSurface/playbackControls/bookmarkList/bookmarkList.component.ng.html',
    bindings: {
      drill: '<',
    },
    controller: function($scope, $rootScope, $timeout, appStateService,
                        drillEditorService, eventService) {
      let ctrl = this;

      ctrl.$onInit = function() {
        ctrl.subscriptions = eventService.createSubscriptionManager();

        // ctrl.subscriptions
        //   .subscribe(Events.drillOpened, (event, args) => {
        //     // $rootScope.$safeApply();
        //   });
      };

      ctrl.$onDestroy = function() {
        ctrl.subscriptions.unsubscribeAll();
      };

      ctrl.$onChanges = function(changes) {
      };

      ctrl.bookmarks = function() {
        if (appStateService.drill
          && appStateService.drill.bookmarks) {
            return appStateService.drill.bookmarks;
          }
        // return [{ count: 0, name: 'The Beginning' }, { count: 12, name: 'Intro' }];
        // return [];
      };

      ctrl.getBookmarkLabel = function(bookmark) {
        return bookmark.count + ': ' + bookmark.name;
      };

      ctrl.goToBookmark = function(bookmark) {
        drillEditorService.goToCount(bookmark.count);
      };

      ctrl.deleteBookmark = function(bookmark) {
        if (!appStateService.drill.bookmarks) return;
        console.log('delete bookmark ' + bookmark.name);
        const i = appStateService.drill.bookmarks.indexOf(bookmark);
        appStateService.drill.bookmarks.splice(i, 1);
      };

      ctrl.addBookmark = function() {
        $('#addBookmarkDialog').modal('show');
      };

      // dialog methods

      ctrl.isValid = function() {
        return ctrl.count && ctrl.name;
      };

      ctrl.save = function() {
        if (!appStateService.drill.bookmarks) {
          appStateService.drill.bookmarks = [];
        }
        appStateService.drill.bookmarks.push({
          count: ctrl.count,
          name: ctrl.name,
        });
      };

      // function blurActiveElement() {
      //   if (document.activeElement) {
      //     document.activeElement.blur();
      //   }
      // }
    },
  });


