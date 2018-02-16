'use strict';

Meteor.methods({
    updateUserProfile: function(profile) {
        let user = Meteor.user();
        if (!user) {
            return null;
        }
        let currentProfile = user.profile || {};
        let mergedProfile = Object.assign(currentProfile, profile);
        Meteor.users.update({ _id: Meteor.userId() }, {
            $set: {
                'profile': mergedProfile,
            },
        },
            function(err) {
                if (err) {
                    console.log('Unable to update user profile.', err);
                }
            });
    },
});
