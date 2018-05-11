'use strict';

import Audio from '/client/lib/audio/Audio';
import Events from '/client/lib/Events';

angular.module('drillApp').component('playbackControls', {
  templateUrl:
    'client/design/designSurface/playbackControls/playbackControls.component.ng.html',
  bindings: {
    drill: '<',
  },
  controller: function(
    $scope,
    $rootScope,
    $timeout,
    appStateService,
    drillEditorService,
    eventService,
    printService
  ) {
    let ctrl = this;

    $scope.tempo = 120;
    $scope.$watch('tempo', function() {
      drillEditorService.setTempo($scope.tempo);
      console.log('tempo', $scope.tempo);
    });

    ctrl.$onInit = function() {
      ctrl.isActivated = true;
      ctrl.subscriptions = eventService.createSubscriptionManager();
      ctrl.currentCount = 0;

      // update position indicator
      ctrl.subscriptions.subscribe(Events.positionIndicator, (event, args) => {
        $scope.currentPosition = args.position;
        $rootScope.$safeApply();
      });

      ctrl.subscriptions.subscribe(Events.membersSelected, (evt, args) => {
        let msg = '';
        if (args.memberSelection && args.memberSelection.members.length > 0) {
          msg = args.memberSelection.members.length + ' selected marchers.';
        }

        $scope.membersSelected = msg;
        $rootScope.$safeApply();
      });

      ctrl.subscriptions.subscribe(Events.drillStateChanged, (evt, args) => {
        ctrl.currentCount = drillEditorService.currentCount;
      });
    };

    ctrl.$onDestroy = function() {
      ctrl.subscriptions.unsubscribeAll();
    };

    ctrl.$onChanges = function(changes) {};

    ctrl.activate = function() {};

    ctrl.deactivate = function() {};

    ctrl.onCountChange = function() {
      console.log(ctrl.currentCount);
      drillEditorService.goToCount(ctrl.currentCount);
    };

    ctrl.toggleMetronome = function() {
      ctrl.isMetronomeEnabled = !ctrl.isMetronomeEnabled;
      blurActiveElement();
    };

    ctrl.showBookmarkList = function() {
      blurActiveElement();
    };

    ctrl.addBookmark = function() {
      blurActiveElement();
    };

    ctrl.onPlay = function(playMusic) {
      // Audio.ensureAudioIsInitialized();
      Audio.init().then(() => {
        drillEditorService.play(
          () => {
            $rootScope.$safeApply();
          },
          0,
          playMusic,
          ctrl.isMetronomeEnabled
        );
        blurActiveElement();
      });
    };

    ctrl.onStop = function() {
      drillEditorService.stop();
      Audio.stop();
      blurActiveElement();
    };

    ctrl.onGoToBeginning = function() {
      drillEditorService.goToBeginning();
      blurActiveElement();
    };

    ctrl.onGoToEnd = function() {
      drillEditorService.goToEnd();
      blurActiveElement();
    };

    ctrl.onStepBackward = function() {
      drillEditorService.stepBackward();
      blurActiveElement();
    };

    ctrl.onStepForward = function() {
      drillEditorService.stepForward();
      blurActiveElement();
    };

    // ctrl.metronomeClick = function() {
    //   Audio.ensureAudioIsInitialized();
    //   Audio.playMetronome();
    // };

    // ctrl.zoomIn = function() {
    //   ctrl.timeline.zoomIn();
    // }

    // ctrl.zoomOut = function() {
    //   ctrl.timeline.zoomOut();
    // }

    ctrl.goToBeginning = function() {
      ctrl.timeline.goToBeginning();
      blurActiveElement();
    };

    ctrl.goToCurrentCount = function() {
      ctrl.timeline.setCurrentCount(10);
    };

    ctrl.goToEnd = function() {
      ctrl.timeline.goToEnd();
      blurActiveElement();
    };

    ctrl.addPrintMark = function() {
      printService.pdfTest();
    };

    // ctrl.pageForward = function() {
    //   ctrl.timeline.pageForward();
    //   blurActiveElement();
    // };

    // ctrl.pageBackward = function() {
    //   console.log('pageBack');
    //   ctrl.timeline.pageBackward();
    //   blurActiveElement();
    // };

    function blurActiveElement() {
      if (document.activeElement) {
        document.activeElement.blur();
      }
    }
  },
});
