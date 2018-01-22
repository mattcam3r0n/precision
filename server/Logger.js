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
        meta.email = getEmail();
        meta.userId = getUserId();
        msg = meta.userId + ' - ' + meta.email + ' - ' + msg;
        Winston.log(level, msg, meta);
    }
}

function getEmail() {
    const user = Meteor.user();
    if (!user || !user.emails || user.emails.length < 1) return null;

    return Meteor.user().emails[0].address;
}

function getUserId() {
    if (!Meteor.user()) return null;

    return Meteor.user()._id;
}

Logger = ServerSideLogger;
