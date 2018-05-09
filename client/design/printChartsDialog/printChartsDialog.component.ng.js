'use strict';

import Events from '/client/lib/Events';

angular.module('drillApp').component('printChartsDialog', {
  templateUrl: 'client/design/printChartsDialog/printChartsDialog.view.ng.html',
  bindings: {},
  controller: function(
    $scope,
    $rootScope,
    $timeout,
    appStateService,
    eventService,
    spinnerService,
    confirmationDialogService,
    printService
  ) {
    let ctrl = this;

    ctrl.$onInit = function() {
      ctrl.activeTab = 'currentCount';
      ctrl.selectedBookmarks = [];
      ctrl.subscriptions = eventService.createSubscriptionManager();
      ctrl.subscriptions.subscribe(
        Events.showPrintChartsDialog,
        ctrl.activate.bind(this)
      );
    };

    ctrl.$onDestroy = function() {
      ctrl.subscriptions.unsubscribeAll();
    };

    ctrl.activate = function() {
      ctrl.selectedBookmarks = ctrl.bookmarks().slice();
      ctrl.name = '';
      ctrl.notes = '';
      ctrl.count = null;
      ctrl.forecastCounts = 0;
      $('#printChartsDialog').modal('show');
    };

    ctrl.getCurrentCount = function() {
      return appStateService.getDrillCount();
    };

    ctrl.print = function() {
      try {
        spinnerService.start();
        $timeout(() => {
          if (ctrl.activeTab == 'bookmarks') {
            printBookmarks();
          } else {
            printCurrentCount();
          }
          spinnerService.stop();
        });
      } catch (error) {
        throw error;
        spinnerService.stop();
      } finally {
      }
    };

    ctrl.bookmarks = function() {
      if (!appStateService.drill || !appStateService.drill.bookmarks) return [];
      return appStateService.drill.bookmarks;
    };

    ctrl.isSelected = function(bookmark) {
      return ctrl.selectedBookmarks.includes(bookmark);
    };

    ctrl.toggleSelected = function(bookmark) {
      if (ctrl.selectedBookmarks.includes(bookmark)) {
        const i = ctrl.selectedBookmarks.indexOf(bookmark);
        ctrl.selectedBookmarks.splice(i, 1);
      } else {
        ctrl.selectedBookmarks.push(bookmark);
      }
    };

    ctrl.selectAll = function() {
      ctrl.selectedBookmarks = ctrl.bookmarks().slice();
    };

    ctrl.deselectAll = function() {
      ctrl.selectedBookmarks = [];
    };

    ctrl.isTabActive = function(tab) {
      return ctrl.activeTab == tab;
    };

    ctrl.setActiveTab = function(tab) {
      ctrl.activeTab = tab;
    };

    function printBookmarks() {
      printService.printBookmarks(ctrl.selectedBookmarks, {
        printInColor: ctrl.printInColor,
      });
      $('#printChartsDialog').modal('hide');
    }

    function printCurrentCount() {
      const bookmark = {
        name: ctrl.name,
        notes: ctrl.notes,
        count: appStateService.getDrillCount(),
        forecastCounts: ctrl.forecastCounts,
      };
      printService.printCurrentCount(bookmark, {
        printInColor: ctrl.printInColor,
      });
      $('#printChartsDialog').modal('hide');
    }
  },
});
