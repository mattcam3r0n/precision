'use strict';

Meteor.methods({
  getLastDrillId: function() {
    console.log('getLastDrillId', Meteor.user());
    var user = Meteor.user();
    if (!user || !user.profile || !user.profile.currentDrillId) 
        return null;

    return user.profile.currentDrillId;
}
});