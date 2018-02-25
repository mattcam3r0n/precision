const defaultStyle = 'growl-top-right';

class AlertService {
    constructor() {
        Bert.defaults = {
            hideDelay: 5000,
            // Accepts: a number in milliseconds.
            style: defaultStyle,
            // Accepts: fixed-top, fixed-bottom, growl-top-left,   growl-top-right,
            // growl-bottom-left, growl-bottom-right.
            type: 'default',
            // Accepts: default, success, info, warning, danger.
        };
    }

    alert(message, type, style) {
        Bert.alert(message, type, style || defaultStyle);
    }

    success(msg) {
        this.alert(msg, 'success', defaultStyle);
    }

    info(msg) {
        this.alert(msg, 'info', defaultStyle);
    }

    warning(msg) {
        this.alert(msg, 'warning', defaultStyle);
    }

    danger(msg) {
        this.alert(msg, 'danger', defaultStyle);
    }

    error(msg) {
        this.alert(msg, 'danger', defaultStyle);
    }
}


angular.module('drillApp')
    .service('alertService', AlertService);
