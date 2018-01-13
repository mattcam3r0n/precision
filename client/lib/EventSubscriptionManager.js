
class EventSubscriptionManagerException {
    constructor(message) {
        this.name = 'EventSubscriptionManagerException';
        this.message = message;
    }
}

class EventSubscriptionManager {
    constructor(eventService) {
        this.eventService = eventService;
        this.subscriptions = {};
    }

    isSubscribed(event) {
        return !!this.subscriptions[event];
    }

    subscribe(event, cb) {
        if (this.subscriptions[event]) {
            throw new EventSubscriptionManagerException('Already subscribed to ' + event);
        }
        this.subscriptions[event] = this.eventService.subscribe(event, cb);
    }

    unsubscribe(event) {
        if (!this.subscriptions[event]) return;
        this.subscriptions[event]();
        delete this.subscriptions[event];
    }

    unsubscribeAll() {
        for(var k in this.subscriptions) {
            let unsub = this.subscriptions[k];
            unsub();
            delete this.subscriptions[k];
        }
        this.subscriptions = {};
    }
}

export default EventSubscriptionManager;
