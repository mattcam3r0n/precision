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
    confirmationDialogService,
    printService
  ) {
    let ctrl = this;

    ctrl.$onInit = function() {
      ctrl.activeTab = 'currentCount';
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
      $('#printChartsDialog').modal('show');
    };

    ctrl.getCurrentCount = function() {
      return appStateService.getDrillCount();
    };

    ctrl.print = function() {
      // TODO: add spinner
      if (ctrl.activeTab == 'bookmarks') {
        printBookmarks();
      } else {
        printCurrentCount();
      }
    };

    ctrl.isTabActive = function(tab) {
      return ctrl.activeTab == tab;
    };

    ctrl.setActiveTab = function(tab) {
      ctrl.activeTab = tab;
    };

    function printBookmarks() {}

    function printCurrentCount() {
      printService.printChart(
        appStateService.getDrillCount(),
        ctrl.notes,
        ctrl.forecastCounts
      );
      $('#printChartsDialog').modal('hide');
    }
  },
});
