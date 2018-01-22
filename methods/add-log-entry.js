'use strict';

Meteor.methods({
    addLogEntry: function(level, msg) {
        if (this.isSimulation) return;

        const ip = this.connection.clientAddress;
        const userAgent = this.connection.httpHeaders['user-agent'];

        if (Meteor.isServer) {
            Logger.log(level, msg, { ip, userAgent });
        }
    },
});
