class Logger {
    static debug(msg) {
        Meteor.call('addLogEntry', 'debug', msg);
    }

    static info(msg) {
        Meteor.call('addLogEntry', 'info', msg);
    }

    static warn(msg) {
        Meteor.call('addLogEntry', 'warn', msg);
    }

    static error(msg) {
        Meteor.call('addLogEntry', 'error', msg);
    }

    static log(level, msg) {
        Meteor.call('addLogEntry', level, msg);
    }
}

export default Logger;
