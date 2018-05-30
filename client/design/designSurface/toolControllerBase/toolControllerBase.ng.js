'use strict';

import Events from '/client/lib/Events';

angular
  .module('drillApp')
  .component('toolBase', {
    // templateUrl:
    //   'client/design/designSurface/maneuvers/toTheRears/toTheRearsTool.view.ng.html',
    bindings: {},
    controller: 'toolBaseController',
  })
  .controller('toolBaseController', function(
    $scope,
    $rootScope,
    $window,
    appStateService,
    drillEditorService,
    alertService,
    eventService
  ) {
    let ctrl = this; //eslint-disable-line

    ctrl._isActivated = false;
    ctrl.subscriptions = eventService.createSubscriptionManager();

    ctrl.$onDestroy = function() {
      ctrl.subscriptions.unsubscribeAll();
    };

    ctrl.setActiveTool = function(toolName) {
      appStateService.setActiveTool(toolName, () => {
        ctrl.deactivate(false);
        console.log(toolName + ' deactivated');
      });
    };

    ctrl.subscribe = function(event, func) {
      ctrl.subscriptions.subscribe(event, func);
    };

    ctrl.getMemberSelection = function() {
      return drillEditorService.getMemberSelection();
    };

    ctrl.currentSelection = function() {
      return ctrl._memberSelection;
    };

    ctrl.hasSelection = function() {
      return (ctrl._memberSelection && ctrl._memberSelection.length > 0);
    };

    ctrl.registerActivateEvent = function(event) {
      ctrl.activateEvent = event;
      ctrl.subscriptions.subscribe(event, (evt, args) => {
        ctrl.activate();
      });
    };

    ctrl.registerDeactivateEvent = function(event) {
      ctrl.deactivateEvent = event;
    };

    ctrl.onActivated = function(callback) {
      ctrl._onActivated = callback;
    };

    ctrl.onDeactivated = function(callback) {
      ctrl._onDeactivated = callback;
    };

    ctrl.onSelectionChanged = function(callback) {
      ctrl._onSelectionChanged = callback;
    };

    ctrl.onSave = function(callback) {
      ctrl._onSave = callback;
    };

    ctrl.onCancel = function(callback) {
      ctrl._onCancel = callback;
    };

    ctrl.save = function() {
      if (ctrl._onSave) {
        ctrl._onSave();
      }
      ctrl.deactivate();
    };

    ctrl.cancel = function() {
      if (ctrl._onCancel) {
        ctrl._onCancel();
      }
      ctrl.deactivate();
    };

    ctrl.isActivated = function() {
      return ctrl._isActivated;
    };

    ctrl.activate = function() {
      ctrl._memberSelection = ctrl.getMemberSelection();
      if (!ctrl._memberSelection || ctrl._memberSelection.length == 0) {
        alertService.info('You must select a block to work with.');
      }
      ctrl.subscribe(Events.membersSelected, onMembersSelected);
      ctrl._isActivated = true;
      if (ctrl._onActivated) {
        ctrl._onActivated();
      }
    };

    ctrl.deactivate = function(notify = true) {
      ctrl.subscriptions.unsubscribe(Events.membersSelected);

      ctrl._isActivated = false;
      eventService.notify(Events.clearFootprints);
      eventService.notify(Events.updateField);
      if (ctrl._onDeactivated) {
        ctrl._onDeactivated();
      }
      if (notify) {
        eventService.notify(ctrl.deactivateEvent);
      }
    };

    function onMembersSelected(evt, args) {
      if (!ctrl.isActivated()) return;
      ctrl._memberSelection = ctrl.getMemberSelection();
      if (ctrl._onSelectionChanged) {
        ctrl._onSelectionChanged({
          memberSelection: ctrl.getMemberSelection(),
        });
      }
      // eventService.notify(Events.drillStateChanged);
    }
  });
