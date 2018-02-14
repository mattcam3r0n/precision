let style = 'growl-top-right';

class AlertService {
    constructor() {
        Bert.defaults = {
            hideDelay: 3000,
            // Accepts: a number in milliseconds.
            style: style,
            // Accepts: fixed-top, fixed-bottom, growl-top-left,   growl-top-right,
            // growl-bottom-left, growl-bottom-right.
            type: 'default',
            // Accepts: default, success, info, warning, danger.
        };
    }

    alert(message, type, style) {
        Bert.alert(message, type, style);
    }

    success(msg) {
        this.alert(msg, 'success', style);
    }

    info(msg) {
        this.alert(msg, 'info', style);
    }

    warning(msg) {
        this.alert(msg, 'warning', style);
    }

    danger(msg) {
        this.alert(msg, 'danger', style);
    }

    error(msg) {
        this.alert(msg, 'danger', style);
    }
}


angular.module('drillApp')
    .service('alertService', AlertService);
