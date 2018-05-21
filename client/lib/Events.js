class Events {
  // TODO: make a clearer distinction between commands and events

  // Commands - message to do something

  static get newDrill() {
    return 'newDrill';
  }

  static get showOpenDrillDialog() {
    return 'showOpenDrillDialog';
  }

  static get showShareDialog() {
    return 'showShareDialog';
  }

  static get showPrintChartsDialog() {
    return 'showPrintChartsDialog';
  }

  static get showKeyboardShortcuts() {
    return 'showKeyboardShortcuts';
  }

  static get showContextMenu() {
    return 'showContextMenu';
  }

  static get showTimelineContextMenu() {
    return 'showTimelineContextMenu';
  }

  static get showTempoDialog() {
    return 'showTempoDialog';
  }

  static get showNewDrillDialog() {
    return 'showNewDrillDialog';
  }

  static get showDrillPropertiesDialog() {
    return 'showDrillPropertiesDialog';
  }

  static get showIntroDialog() {
    return 'showIntroDialog';
  }

  static get showReleaseNotesDialog() {
    return 'showReleaseNotesDialog';
  }

  static get showSaveAsDialog() {
    return 'showSaveAsDialog';
  }

  static get showBookmarkDialog() {
    return 'showBookmarkDialog';
  }

  static get sizeToFit() {
    return 'sizeToFit';
  }

  static get zoomIn() {
    return 'zoomIn';
  }

  static get zoomOut() {
    return 'zoomOut';
  }

  static get showSpinner() {
    return 'showSpinner';
  }

  static get hideSpinner() {
    return 'hideSpinner';
  }

  static get showLogo() {
    return 'showLogo';
  }

  static get hideLogo() {
    return 'hideLogo';
  }

  static get showGrid() {
    return 'showGrid';
  }

  static get hideGrid() {
    return 'hideGrid';
  }

  static get activatePinwheelTool() {
    return 'activatePinwheelTool';
  }

  static get activateDragStepTool() {
    return 'activateDragStepTool';
  }

  static get activateReverseTool() {
    return 'activateReverseTool';
  }

  static get activateCountermarchTool() {
    return 'activateCountermarchTool';
  }

  static get activateIllinoisTool() {
    return 'activateIllinoisTool';
  }
  
  static get activateTexasTurnTool() {
    return 'activateTexasTurnTool';
  }

  static get activateMarcherColorsTool() {
    return 'activateMarcherColorsTool';
  }

  static get showConfirmationDialog() {
    return 'showConfirmationDialog';
  }

  // Events - notification that something has happened

  static get bookmarkChanged() {
    return 'bookmarkChanged';
  }

  static get fieldRenderComplete() {
    return 'fieldRenderComplete';
  }

  static get confirmationDialogClosed() {
    return 'confirmationDialogClosed';
  }

  static get userSelected() {
    return 'userSelected';
  }

  static get strideTypeChanged() {
    return 'strideTypeChanged';
  }

  static get musicChanged() {
    return 'musicChanged';
  }

  static get drillOpened() {
    return 'drillOpened';
  }

  static get drillDeleted() {
    return 'drillDeleted';
  }

  static get drillSavedAs() {
    return 'drillSavedAs';
  }

  static get membersAdded() {
    return 'membersAdded';
  }

  static get membersChanged() {
    return 'membersChanged';
  }

  static get membersSelected() {
    return 'membersSelected';
  }

  static get showFootprints() {
    return 'showFootprints';
  }

  static get clearFootprints() {
    return 'clearFootprints';
  }

  static get drillPropertiesChanged() {
    return 'drillPropertiesChanged';
  }

  static get drillStateChanged() {
    return 'drillStateChanged';
  }

  static get addStepsToolActivated() {
    return 'addStepsToolActivated';
  }

  static get drawPathsToolActivated() {
    return 'drawPathsToolActivated';
  }

  static get drawPathsToolDeactivated() {
    return 'drawPathsToolDeactivated';
  }

  static get addMembersToolActivated() {
    return 'addMembersToolActivated';
  }

  static get pinwheelToolActivated() {
    return 'pinwheelToolActivated';
  }

  static get pinwheelToolDeactivated() {
    return 'pinwheelToolDeactivated';
  }

  static get marcherColorsToolDeactivated() {
    return 'marcherColorsToolDeactivated';
  }

  static get dragStepToolActivated() {
    return 'dragStepToolActivated';
  }

  static get dragStepToolDeactivated() {
    return 'dragStepToolDeactivated';
  }

  static get reverseToolDeactivated() {
    return 'reverseToolDeactivated';
  }

  static get countermarchToolDeactivated() {
    return 'countermarchToolDeactivated';
  }

  static get illinoisToolDeactivated() {
    return 'illinoisToolDeactivated';
  }
  static get texasTurnToolDeactivated() {
    return 'texasTurnToolDeactivated';
  }

  static get objectsSelected() {
    return 'objectsSelected';
  }

  static get positionIndicator() {
    return 'positionIndicator';
  }

  static get resize() {
    return 'resize';
  }

  static get deleteTurn() {
    return 'deleteTurn';
  }

  static get updateField() {
    return 'updateField';
  }

  static get chooseMusicDialogActivated() {
    return 'chooseMusicDialogActivated';
  }

  static get uploadMusicDialogActivated() {
    return 'uploadMusicDialogActivated';
  }

  static get audioClipDialogActivated() {
    return 'audioClipDialogActivated';
  }

  static get audioClipAdded() {
    return 'audioClipAdded';
  }
}

export default Events;
