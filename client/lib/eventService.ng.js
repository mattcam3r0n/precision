import Events from './Events';

class EventService {
    constructor($rootScope) {
        this.$rootScope = $rootScope.$new(true);
    }

    // Events

    subscribe(event, cb) {
        if (!event && !cb) return;
        
        return this.$rootScope.$on(event, cb);
    }

    notify(event, args) {
        if (!event) return;

        this.$rootScope.$broadcast(event, args);
    }

    subscribeAddStepsToolActivated(cb) {
        var unsubscribe = this.$rootScope.$on(Events.addStepsToolActivated, cb);
        return unsubscribe;
    }

    notifyAddStepsToolActivated(args) {
        this.$rootScope.$broadcast(Events.addStepsToolActivated, args);
    }

    subscribeDrawPathsToolActivated(cb) {
        var unsubscribe = this.$rootScope.$on(Events.drawPathsToolActivated, cb);
        return unsubscribe;
    }

    notifyDrawPathsToolActivated(args) {
        this.$rootScope.$broadcast(Events.drawPathsToolActivated, args);
    }

    subscribeAddMembersToolActivated(cb) {
        var unsubscribe = this.$rootScope.$on(Events.addMembersToolActivated, cb);
        return unsubscribe;
    }

    notifyAddMembersToolActivated(args) {
        this.$rootScope.$broadcast(Events.addMembersToolActivated, args);
    }

    subscribeObjectsSelected(cb) {
        var unsubscribe = this.$rootScope.$on(Events.objectsSelected, cb);
        return unsubscribe;
    }

    notifyObjectsSelected(args) {
        this.$rootScope.$broadcast(Events.objectsSelected, args);
    }

    subscribePositionIndicator(cb) {
        var unsubscribe = this.$rootScope.$on(Events.positionIndicator, cb);
        return unsubscribe;
    }

    notifyPositionIndicator(args) {
        this.$rootScope.$broadcast(Events.positionIndicator, args);
    }

    subscribeResize(cb) {
        var unsubscribe = this.$rootScope.$on(Events.resize, cb);
        return unsubscribe;
    }

    notifyResize(args) {
        this.$rootScope.$broadcast(Events.resize, args);
    }
    
    subscribeSizeToFit(cb) {
        var unsubscribe = this.$rootScope.$on(Events.sizeToFit, cb);
        return unsubscribe;
    }

    notifySizeToFit(args) {
        this.$rootScope.$broadcast(Events.sizeToFit, args);
    }

    subscribeZoomIn(cb) {
        var unsubscribe = this.$rootScope.$on(Events.zoomIn, cb);
        return unsubscribe;
    }

    notifyZoomIn(args) {
        this.$rootScope.$broadcast(Events.zoomIn, args);
    }

    subscribeZoomOut(cb) {
        var unsubscribe = this.$rootScope.$on(Events.zoomOut, cb);
        return unsubscribe;
    }

    notifyZoomOut(args) {
        this.$rootScope.$broadcast(Events.zoomOut, args);
    }

    subscribeDeleteTurn(cb) {
        var unsubscribe = this.$rootScope.$on(Events.deleteTurn, cb);
        return unsubscribe;
    }

    notifyDeleteTurn(args) {
        this.$rootScope.$broadcast(Events.deleteTurn, args);
    }

    subscribeUpdateField(cb) {
        var unsubscribe = this.$rootScope.$on(Events.updateField, cb);
        return unsubscribe;
    }

    notifyUpdateField(args) {
        this.$rootScope.$broadcast(Events.updateField, args);
    }

    subscribeChooseMusicDialogActivated(cb) {
        return this.$rootScope.$on(Events.chooseMusicDialogActivated, cb);
    }

    notifyChooseMusicDialogActivated(args) {
        this.$rootScope.$broadcast(Events.chooseMusicDialogActivated, args);
    }

    subscribeUploadMusicDialogActivated(cb) {
        return this.$rootScope.$on(Events.uploadMusicDialogActivated, cb);
    }

    notifyUploadMusicDialogActivated(args) {
        this.$rootScope.$broadcast(Events.uploadMusicDialogActivated, args);
    }

    subscribeAudioClipDialogActivated(cb) {
        return this.$rootScope.$on(Events.audioClipDialogActivated, cb);        
    }

    notifyAudioClipDialogActivated(args) {
        this.$rootScope.$broadcast(Events.audioClipDialogActivated, args);        
    }

    subscribeAudioClipAdded(cb) {
        return this.$rootScope.$on(Events.audioClipAdded, cb);
    }

    notifyAudioClipAdded(args) {
        this.$rootScope.$broadcast(Events.audioClipAdded, args);
    }

    subscribeShowSpinner(cb) {
        return this.$rootScope.$on(Events.showSpinner, cb);
    }

    notifyShowSpinner(args) {
        this.$rootScope.$broadcast(Events.showSpinner, args);
    }

    subscribeHideSpinner(cb) {
        return this.$rootScope.$on(Events.hideSpinner, cb);
    }

    notifyHideSpinner(args) {
        this.$rootScope.$broadcast(Events.hideSpinner, args);
    }
}


angular.module('drillApp')
    .service('eventService', ['$rootScope', EventService]);
