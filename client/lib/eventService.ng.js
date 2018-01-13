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
    
}


angular.module('drillApp')
    .service('eventService', ['$rootScope', EventService]);
