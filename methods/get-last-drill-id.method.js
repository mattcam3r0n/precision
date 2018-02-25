'use strict';

Meteor.methods({
  getLastDrillId: function() {
    let user = Meteor.user();
    if (!user || !user.profile || !user.profile.lastDrillId) {
        return null;
    }

    const lastDrillId = user.profile.lastDrillId;

    const drill = Drills.findOne(lastDrillId);

    if (!drill) {
        return null;
    }

    return lastDrillId;
},
});
