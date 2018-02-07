'use strict';

Meteor.methods({
    addLogEntry: function(level, msg, meta) {
        if (this.isSimulation) return;
        const newMeta = {
            meta: meta,
        };
        newMeta.ip = this.connection.clientAddress;
        newMeta.userAgent = this.connection.httpHeaders['user-agent'];

        if (Meteor.isServer) {
            Logger.log(level, msg, newMeta);
        }
    },
});
