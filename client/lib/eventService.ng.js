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
