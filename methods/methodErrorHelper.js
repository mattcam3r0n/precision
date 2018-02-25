throwError = function(error, reason, details) {
    const meteorError = new Meteor.Error(error, reason, details);

    if (Meteor.isClient) {
        // this error is never used
        // on the client, the return value of a stub is ignored
        return meteorError;
    } else if (Meteor.isServer) {
        throw meteorError;
    }
};
