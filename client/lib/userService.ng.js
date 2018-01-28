import { Meteor } from 'meteor/meteor';

class UserService {
    constructor() {
        this.userProfile = this.getUserProfile();
    }

    getUserProfile() {
        if (!Meteor.user()) return {};

        return Meteor.user().profile || {};
    }

    updateUserProfile(profile) {
        if (!Meteor.user()) return;
        Meteor.call('updateUserProfile', profile);
    }

    getUserEmail() {
        let user = Meteor.user();
        if (!user || !user.emails || user.emails.length == 0) {
            return null;
        }

        return user.emails[0].address;
    }

    getUserId() {
        let user = Meteor.user();
        if (!user || !user._id) {
            return null;
        }

        return user._id;
    }
}

angular.module('drillApp')
    .service('userService',
        [UserService]);
