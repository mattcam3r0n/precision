'use strict';

Meteor.methods({
    updateUserProfile: function(profile) {
        let user = Meteor.user();
        if (!user) {
            return null;
        }
        Meteor.users.update({ _id: Meteor.userId() }, {
            $set: {
                'profile': profile,
            },
        },
            function(err) {
                if (err) {
                    console.log('Unable to update user profile.', err);
                }
            });
    },
});
