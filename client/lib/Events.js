class Events {
    // TODO: make a clearer distinction between commands and events

    // Commands - message to do something

    static get newDrill() {
        return 'newDrill';
    }

    static get showOpenDrillDialog() {
        return 'showOpenDrillDialog';
    }

    static get showDrillPropertiesDialog() {
        return 'showDrillPropertiesDialog';
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

    static get activateMarcherColorsTool() {
        return 'activateMarcherColorsTool';
    }

    static get showConfirmationDialog() {
        return 'showConfirmationDialog';
    }

    // Events - notification that something has happened

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

    static get membersAdded() {
        return 'membersAdded';
    }

    static get membersChanged() {
        return 'membersChanged';
    }

    static get membersSelected() {
        return 'membersSelected';
    }

    static get showPaths() {
        return 'showPaths';
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
