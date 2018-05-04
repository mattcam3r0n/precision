'use strict';

import Events from '/client/lib/Events';

angular.module('drillApp').component('contextMenu', {
  templateUrl: 'client/design/contextMenu/contextMenu.component.ng.html',
  bindings: {},
  controller: function(
    $scope,
    $rootScope,
    $document,
    confirmationDialogService,
    drillEditorService,
    eventService
  ) {
    let ctrl = this;

    const instrumentColors = {
      twirler: 'lightblue',
      flag: 'orchid',
      flute: 'pink',
      clarinet: 'gainsboro',
      lowreed: 'indigo',
      saxophone: 'lightgreen',
      trumpet: 'blue',
      horn: 'gold',
      trombone: 'fuchsia',
      baritone: 'purple',
      tuba: 'orange',
      percussion: 'gray',
    };

    ctrl.$onInit = function() {
      ctrl.isActivated = false;
      ctrl.subscriptions = eventService.createSubscriptionManager();

      ctrl.subscriptions.subscribe(Events.showContextMenu, (evt, args) => {
        activate(args);
      });

      $document.click((evt) => {
        deactivate();
      });
      // $('body').mousedown((evt)=> {
      //   console.log(evt);
      //   if (evt.target.nodeName != 'A') {
      //     deactivate();
      //   }
      // });
    };

    ctrl.$onDestroy = function() {};

    $scope.activate = activate;

    $scope.deactivate = function() {};

    $scope.cancel = deactivate;

    ctrl.deleteForward = function() {
      drillEditorService.deleteForward();
    };

    ctrl.addMarchers = function() {
      // always go to beginning when adding new marchers
      drillEditorService.goToBeginning();
      eventService.notify(Events.addMembersToolActivated);
    };

    ctrl.deleteMarchers = function() {
      const selection = drillEditorService.getMemberSelection();
      if (selection.members.length === 0) return;

      confirmationDialogService
        .show({
          heading: 'Delete Marchers',
          message: 'Delete ' + selection.members.length + ' marchers?',
          confirmText: 'Delete',
        })
        .then((result) => {
          if (result.confirmed) {
            drillEditorService.deleteSelectedMembers();
          }
        });
    };

    ctrl.setColor = function(instrument) {
      const memberSelection = drillEditorService.getMemberSelection();
      memberSelection.members.forEach((member) => {
        member.color = instrumentColors[instrument];
      });
      eventService.notify(Events.membersChanged);
      drillEditorService.deselectAll();
      drillEditorService.save(true);
    };

    ctrl.selectAll = function() {
      drillEditorService.selectAll();
    };

    ctrl.selectXandO = function() {
      drillEditorService.selectXandO();
    };

    ctrl.selectAlternatingFiles = function() {
      drillEditorService.selectAlternatingFiles();
    };

    ctrl.selectAlternatingRanks = function() {
      drillEditorService.selectAlternatingRanks();
    };

    ctrl.deselectAll = function() {
      drillEditorService.deselectAll();
    };

    ctrl.hideUnselected = function() {
      drillEditorService.hideUnselected();
    };

    ctrl.showUnselected = function() {
      drillEditorService.showAll();
    };

    function activate(args) {
      if (ctrl.isActivated) {
        deactivate();
      }

      ctrl.isActivated = true;
      console.log(args);
      $('div.context-menu').css({ top: args.point.top, left: args.point.left });
      $('div.context-menu div.dropdown').addClass('open');
      $rootScope.$safeApply();
    }

    function deactivate() {
      ctrl.isActivated = false;
      $('div.context-menu div.dropdown').removeClass('open');
    }
  },
});
