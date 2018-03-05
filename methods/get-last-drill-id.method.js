'use strict';

Meteor.methods({
  getLastDrillId: function() {
    let user = Meteor.user();
    if (!user || !user.profile || !user.profile.lastDrillId) {
        return null;
    }

    const lastDrillId = user.profile.lastDrillId;

    try {
        const sanitizedId = sanitizeId(lastDrillId);
        const drill = Drills.findOne(sanitizedId);

        if (!drill) {
            return null;
        }
        return lastDrillId;
    } catch (ex) {
        throwError('get-last-drill-id-error', ex.message, ex);
    }
},
});
