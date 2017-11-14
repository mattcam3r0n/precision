import Events from './Events';

class EventService {
    constructor($rootScope) {
        this.$rootScope = $rootScope.$new(true);
    }

    // Events

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
}


angular.module('drillApp')
    .service('eventService', ['$rootScope', EventService]);
