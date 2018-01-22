class Logger {
    static debug(msg, meta) {
        Meteor.call('addLogEntry', 'debug', msg, meta);
    }

    static info(msg, meta) {
        Meteor.call('addLogEntry', 'info', msg, meta);
    }

    static warn(msg, meta) {
        Meteor.call('addLogEntry', 'warn', msg, meta);
    }

    static error(msg, meta) {
        Meteor.call('addLogEntry', 'error', msg, meta);
    }

    static log(level, msg, meta) {
        Meteor.call('addLogEntry', level, msg, meta);
    }
}

export default Logger;
