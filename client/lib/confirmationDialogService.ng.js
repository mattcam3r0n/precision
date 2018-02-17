import Events from '/client/lib/Events';

class confirmationDialogService {
    constructor($rootScope, eventService) {
        this.eventService = eventService;
        this.rootScope = $rootScope.$new(true);
    }

    show(options) {
        const self = this;
        options = options || {},
        self.eventService.notify(Events.showConfirmationDialog, {
            heading: options.heading,
            message: options.message,
            confirmText: options.confirmText,
            cancelText: options.cancelText,
        });
        return new Promise((resolve, reject) => {
            const unsubscribe = self.eventService
                .subscribe(Events.confirmationDialogClosed, (evt, args) => {
                    unsubscribe();
                    console.log('dialog closed', args);
                    resolve(args);
                });
        });
    }

}

angular.module('drillApp')
    .service('confirmationDialogService',
        ['$rootScope', 'eventService', confirmationDialogService]);
