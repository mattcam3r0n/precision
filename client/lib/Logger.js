class Logger {
    static debug(msg, meta) {
        this.log('debug', msg, meta);
    }

    static info(msg, meta) {
        this.log('info', msg, meta);
    }

    static warn(msg, meta) {
        this.log('warn', msg, meta);
    }

    static error(msg, meta) {
        this.log('error', msg, meta);
    }

    static log(level, msg, meta) {
        Meteor.call('addLogEntry', level, msg, meta);
    }
}

export default Logger;
