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

    static logException(ex) {
        this.error(ex.message || ex, { exception: ex });
        if (ex.stack || (ex.inner && ex.inner.stack)) {
            this.error(ex.message || ex, ex.stack || ex.inner.stack);
        }
    }
}

export default Logger;
