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

    notifyAddStepsToolActivated() {
        this.$rootScope.$broadcast(Events.addStepsToolActivated);
    }

    subscribeDrawPathsToolActivated(cb) {
        var unsubscribe = this.$rootScope.$on(Events.drawPathsToolActivated, cb);
        return unsubscribe;
    }

    notifyDrawPathsToolActivated() {
        this.$rootScope.$broadcast(Events.drawPathsToolActivated);
    }

    subscribeAddMembersToolActivated(cb) {
        var unsubscribe = this.$rootScope.$on(Events.addMembersToolActivated, cb);
        return unsubscribe;
    }

    notifyAddMembersToolActivated() {
        this.$rootScope.$broadcast(Events.addMembersToolActivated);
    }
}


angular.module('drillApp')
    .service('eventService', ['$rootScope', EventService]);
