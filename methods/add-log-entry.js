'use strict';

Meteor.methods({
    addLogEntry: function(level, msg, meta) {
        if (this.isSimulation) return;
        meta = meta || {};
        // const newMeta = {
        //     meta: meta,
        // };
        meta.ip = this.connection.clientAddress;
        meta.userAgent = this.connection.httpHeaders['user-agent'];

        if (Meteor.isServer) {
            Logger.log(level, msg, meta);
        }
    },
});
