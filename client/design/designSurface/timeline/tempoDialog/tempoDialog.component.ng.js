'use strict';

import Events from '/client/lib/Events';

angular.module('drillApp').component('tempoDialog', {
  templateUrl:
    'client/design/designSurface/timeline/tempoDialog/tempoDialog.component.ng.html',
  bindings: {},
  controller: function(
    $scope,
    $rootScope,
    $timeout,
    appStateService,
    drillEditorService,
    eventService
  ) {
    let ctrl = this;

    ctrl.$onInit = function() {
      ctrl.subscriptions = eventService.createSubscriptionManager();

      ctrl.subscriptions.subscribe(Events.showTempoDialog, onShowTempoDialog);
    };

    ctrl.$onDestroy = function() {
      ctrl.subscriptions.unsubscribeAll();
    };

    ctrl.$onChanges = function(changes) {};

    // dialog methods

    ctrl.isValid = function() {
      return ctrl.tempo && ctrl.startCount && ctrl.endCount;
    };

    ctrl.save = function() {
      ctrl.isEditMode ? saveEdit() : saveNew();
    };

    function saveNew() {
      if (!appStateService.drill.music) {
        appStateService.drill.music = [];
      }
      appStateService.drill.music.push({
        type: 'tempo',
        tempo: ctrl.tempo,
        startCount: ctrl.startCount,
        endCount: ctrl.endCount,
      });
      drillEditorService.save(true);
      eventService.notify(Events.audioClipAdded);
    }

    function saveEdit() {
      ctrl.tempoItem.tempo = ctrl.tempo;
      ctrl.tempoItem.startCount = ctrl.startCount;
      ctrl.tempoItem.endCount = ctrl.endCount;
      drillEditorService.save(true);
      eventService.notify(Events.audioClipAdded);
    }

    function onShowTempoDialog(evt, args) {
      if (args && args.tempoItem) {
        ctrl.isEditMode = true;
        ctrl.tempoItem = args.tempoItem;
        ctrl.tempo = args.tempoItem ? args.tempoItem.tempo : 120;
        ctrl.startCount = args.tempoItem ? args.tempoItem.startCount : null;
        ctrl.endCount = args.tempoItem ? args.tempoItem.endCount : null;
      }
      showTempoDialog();
    }

    function showTempoDialog() {
      $('#tempoDialog').modal('show');
      $rootScope.$safeApply();
    }
  },
});
