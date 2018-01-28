if (Meteor.isServer) {
    // TODO: grab some of these from settings, like port, host name, etc.

    Winston.add(Winston_Papertrail, {
        levels: {
            debug: 0,
            info: 1,
            warn: 2,
            error: 3,
            auth: 4,
        },
        colors: {
            debug: 'blue',
            info: 'green',
            warn: 'red',
            error: 'red',
            auth: 'red',
        },

        host: 'logs.papertrailapp.com',
        port: 22145, // TODO: get this from settings
        handleExceptions: false,
        json: true,
        colorize: true,
        logFormat: function(level, message) {
            return level + ': ' + message;
        },
        program: 'precision',
//        hostname: 'preision.local',
//        inlineMeta: true,
    });

    Winston.info(' =====> Meteor App restarted ' + new Date(Date.now()) + ' <=====');
}
