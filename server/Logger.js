import User from '/lib/User';

class ServerSideLogger {
    static debug(msg) {
        this.log('debug', msg);
    }

    static info(msg) {
        this.log('info', msg);
    }

    static warn(msg) {
        this.log('warn', msg);
    }

    static error(msg) {
        this.log('error', msg);
    }

    static log(level, msg, meta) {
        meta = meta || {};
        meta.email = User.getUserEmail();
        meta.userId = User.getUserId();
        msg = meta.userId + ' - ' + meta.email + ' - ' + msg;
        Winston.log(level, msg, meta);
    }
}

Logger = ServerSideLogger;
