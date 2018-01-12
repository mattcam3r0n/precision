'use strict';

Meteor.methods({
    updateUserProfile: function (profile) {
        var user = Meteor.user();
        if (!user || !user.profile)
            return null;

        Meteor.users.update({ _id: Meteor.userId() }, {
            $set: {
                "profile": profile
            }
        },
            function (err) {
                if (err)
                    console.log('Unable to update user profile.', err);
            });

    }
});