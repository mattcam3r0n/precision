import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import User from '/lib/User';

class UserService {
    constructor() {
        this.userProfile = this.getUserProfile();
    }

    isLoggedIn() {
        return !!Meteor.user();
    }

    isAdmin() {
        if (!Meteor.user()) return false;
        return Roles.userIsInRole(Meteor.userId(), 'admin');
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
        return User.getUserEmail();
    }

    getUserId() {
        return User.getUserId();
    }

    logIn(email, password) {
        return new Promise((resolve, reject) => {
            Meteor.loginWithPassword(email, password, (err) => {
                if (err) {
                    return reject(new UserServiceException('loginWithPassword failed.', err, {
                        email: email,
                    }));
                }
                // The user has been logged in.
                Meteor.call('updateLoginStats', User.getUserId());
                resolve();
            });
        });
    }

    logOut() {
        Meteor.logout(function(err) {
            if (err) {
                throw new UserServiceException('logOut failed.', err);
            }
        });
    }

    forgotPassword(email) {
        Accounts.forgotPassword({ email: email }, (err) => {
            if (err) {
                throw new UserServiceException('Error in forgotPassword.', err, {
                    email: email,
                });
            }
        });
    }

    createAccount(info) {
        return new Promise((resolve, reject) => {
            Accounts.createUser(info, (err) => {
                if (err) {
                    return reject(new UserServiceException(err.reason, err, {
                        email: info.email,
                        firstName: info.profile.firstName,
                        lastName: info.profile.lastName,
                        orgName: info.profile.orgName,
                    }));
                }
                resolve();
            });
        });
    }

    deleteAccount(id) {
        Meteor.call('deleteUser', id);
    }
}

angular.module('drillApp')
    .service('userService',
    [UserService]);

class UserServiceException {
    constructor(msg, inner, context) {
        this.message = msg;
        this.inner = inner;
        this.context = context;
    }

    toString() {
        return this.message;
    }
}
