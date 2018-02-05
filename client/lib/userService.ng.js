import { Meteor } from 'meteor/meteor';
import User from '/lib/User';

class UserService {
    constructor($location) {
        this.$location = $location;
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
        // let user = Meteor.user();
        // if (!user || !user.emails || user.emails.length == 0) {
        //     return null;
        // }

        // return user.emails[0].address;
        return User.getUserEmail();
    }

    getUserId() {
        // let user = Meteor.user();
        // if (!user || !user._id) {
        //     return null;
        // }

        // return user._id;
        return User.getUserId();
    }

    logIn(email, password) {
        Meteor.loginWithPassword(email, password, (err) => {
            if (err) {
                // The user might not have been found, or their passwword
                // could be incorrect. Inform the user that their
                // login attempt has failed.
                console.log(err);
            } else {
                console.log('logged in');
                this.$location.path('/');
            }
            // The user has been logged in.
        });
    }

    logOut() {
        Meteor.logout(function(err) {
            if (err) {
                console.log(err);
            }
        });
    }
}

angular.module('drillApp')
    .service('userService',
    ['$location', UserService]);
