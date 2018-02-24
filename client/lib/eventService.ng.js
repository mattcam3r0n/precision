import EventSubscriptionManager from './EventSubscriptionManager';

class EventService {
    constructor($rootScope) {
        this.$rootScope = $rootScope.$new(true);
    }

    subscribe(event, cb) {
        if (!event && !cb) return;
        return this.$rootScope.$on(event, cb);
    }

    notify(event, args) {
        if (!event) return;
        this.$rootScope.$broadcast(event, args);
    }

    createSubscriptionManager() {
        return new EventSubscriptionManager(this);
    }
}


angular.module('drillApp')
    .service('eventService', ['$rootScope', EventService]);
