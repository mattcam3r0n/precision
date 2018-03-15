'use strict';

import Events from '/client/lib/Events';

angular.module('drillApp')
  .component('contextMenu', {
    templateUrl: 'client/design/contextMenu/contextMenu.component.ng.html',
    bindings: {
    },
    controller: function($scope, $rootScope, $document,
      confirmationDialogService, drillEditorService, eventService) {
      let ctrl = this;

      const instrumentColors = {
        flute: 'pink',
        clarinet: 'gainsboro',
        lowreed: 'indigo',
        saxophone: 'green',
        trumpet: 'blue',
        horn: 'gold',
        trombone: 'red',
        tuba: 'orange',
        percussion: 'gray',
      };

      ctrl.$onInit = function() {
        ctrl.isActivated = false;
        ctrl.subscriptions = eventService.createSubscriptionManager();

        ctrl.subscriptions.subscribe(Events.showContextMenu, (evt, args) => {
            activate(args);
        });

        $document.click((evt)=>{
          console.log(evt);
          deactivate();
        });
        // $('body').mousedown((evt)=> {
        //   console.log(evt);
        //   if (evt.target.nodeName != 'A') {
        //     deactivate();
        //   }
        // });
      };

      ctrl.$onDestroy = function() {
      };

      $scope.activate = activate;

      $scope.deactivate = function() {
      };

      $scope.cancel = deactivate;

      ctrl.addMarchers = function() {
        // always go to beginning when adding new marchers
        drillEditorService.goToBeginning();
        eventService.notify(Events.addMembersToolActivated);
      };

      ctrl.deleteMarchers = function() {
        const selection = drillEditorService.getMemberSelection();
        if (selection.members.length === 0) return;

        confirmationDialogService.show({
          heading: 'Delete Marchers',
          message: 'Delete ' + selection.members.length + ' marchers?',
          confirmText: 'Delete',
        }).then((result) => {
          if (result.confirmed) {
            drillEditorService.deleteSelectedMembers();
          }
        });
      };

      ctrl.setColor = function(instrument) {
        console.log('setColor');
        const memberSelection = drillEditorService.getMemberSelection();
        memberSelection.members.forEach((member) => {
          member.color = instrumentColors[instrument];
        });
        eventService.notify(Events.membersChanged);
        drillEditorService.deselectAll();
        drillEditorService.save(true);
      };


      ctrl.selectAll = function() {
        console.log('select all');
        drillEditorService.selectAll();
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


