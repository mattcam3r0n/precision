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

    // Events - notification that something has happened

    static get membersAdded() {
        return 'membersAdded';
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

    static get showTimeline() {
        return 'showTimeline';
    }

    static get showSpinner() {
        return 'showSpinner';
    }

    static get hideSpinner() {
        return 'hideSpinner';
    }
}

export default Events;