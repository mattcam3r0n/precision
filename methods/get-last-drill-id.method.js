'use strict';

Meteor.methods({
  getLastDrillId: function() {
    var user = Meteor.user();
    if (!user || !user.profile || !user.profile.currentDrillId) 
        return null;

    return user.profile.currentDrillId;
}
});