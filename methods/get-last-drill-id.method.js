'use strict';

Meteor.methods({
  getLastDrillId: function() {
    let user = Meteor.user();
    if (!user || !user.profile || !user.profile.lastDrillId) {
        return null;
    }

    return user.profile.lastDrillId;
},
});
