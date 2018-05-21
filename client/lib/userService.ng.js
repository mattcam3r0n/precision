import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import User from '/lib/User';
import Logger from '/client/lib/Logger';

class UserService {
  constructor($location) {
    this.$location = $location;
    this.profile = {};
    Tracker.autorun(() => {
      if (Meteor.user()) {
        this.profile = Meteor.user().profile || {};
      }
    });
  }

  isLoggedIn() {
    return !!Meteor.user();
  }

  isAdmin() {
    if (!Meteor.user()) return false;
    return Roles.userIsInRole(Meteor.userId(), 'admin');
  }

  get userProfile() {
    return this.profile;
  }

  getUserProfile() {
    return this.userProfile;
  }

  get dontShowIntro() {
    if (this.userProfile.dontShowIntro === undefined) {
      return true;
    }
    return this.userProfile.dontShowIntro;
  }

  set dontShowIntro(value) {
    this.userProfile.dontShowIntro = value;
  }

  get releaseNotesVersion() {
    return this.userProfile.releaseNotesVersion;
  }

  set releaseNotesVersion(value) {
    this.userProfile.releaseNotesVersion = value;
  }

  get isGridVisible() {
    if (this.userProfile.isGridVisible === undefined) {
      this.userProfile.isGridVisible = false;
    }
    return this.userProfile.isGridVisible;
  }

  set isGridVisible(value) {
    this.userProfile.isGridVisible = value;
  }

  get isLogoVisible() {
    if (this.userProfile.isLogoVisible === undefined) {
      this.userProfile.isLogoVisible = true;
    }
    return this.userProfile.isLogoVisible;
  }

  set isLogoVisible(value) {
    this.userProfile.isLogoVisible = value;
  }

  get lastDrillId() {
    return this.userProfile.lastDrillId;
  }

  set lastDrillId(lastDrillId) {
    this.userProfile.lastDrillId = lastDrillId;
    this.addRecentDrill(lastDrillId);
  }

  addRecentDrill(drillId) {
    this.recentDrills.unshift(drillId);
    this.ensureRecentDrillsAreUnique();
  }

  get recentDrills() {
    if (!this.userProfile.recentDrills) {
      this.userProfile.recentDrills = [];
    }
    return this.userProfile.recentDrills;
  }

  set recentDrills(recentDrills) {
    this.userProfile.recentDrills = recentDrills;
    this.ensureRecentDrillsAreUnique();
  }

  getNextNewDrillSuffix() {
    if (!this.userProfile.newDrillSuffix) {
      this.userProfile.newDrillSuffix = 0;
    }
    this.userProfile.newDrillSuffix++;
    return this.userProfile.newDrillSuffix;
  }

  ensureRecentDrillsAreUnique() {
    this.userProfile.recentDrills = [
      ...new Set(this.userProfile.recentDrills),
    ].slice(0, 10);
  }

  updateUserProfile(profile) {
    if (!Meteor.user()) return;
    profile = profile || this.userProfile;
    console.log('updateUserProfile', profile);
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
          return reject(
            new UserServiceException('loginWithPassword failed.', err, {
              email: email,
            })
          );
        }
        // The user has been logged in.
        Meteor.call('updateLoginStats', User.getUserId());
        resolve();
      });
    });
  }

  logOut() {
    const self = this;
    Meteor.logout(function(err) {
      if (err) {
        throw new UserServiceException('logOut failed.', err);
      } else {
        self.$location.path('/login');
      }
    });
  }

  changePassword(oldPassword, newPassword) {
    return new Promise((resolve, reject) => {
      Accounts.changePassword(oldPassword, newPassword, (err) => {
        if (err) {
          return reject(
            new UserServiceException('Error in changePassword.', err)
          );
        }
        Logger.info(User.getUserEmail() + ' changed their password.');
        resolve();
      });
    });
  }

  forgotPassword(email) {
    return new Promise((resolve, reject) => {
      Accounts.forgotPassword({ email: email }, (err) => {
        if (err) {
          return reject(
            new UserServiceException('Error in forgotPassword.', err, {
              email: email,
            })
          );
        }
        Logger.info(email + ' requested password reset.');
        resolve();
      });
    });
  }

  resetPassword(token, newPassword) {
    return new Promise((resolve, reject) => {
      Accounts.resetPassword(token, newPassword, (err) => {
        if (err) {
          return reject(
            new UserServiceException('Error in resetPassword.', err)
          );
        }
        Logger.info(User.getUserEmail() + ' completed a password reset.');
        resolve();
      });
    });
  }

  createAccount(info) {
    return new Promise((resolve, reject) => {
      Accounts.createUser(info, (err) => {
        if (err) {
          return reject(
            new UserServiceException(err.reason, err, {
              email: info.email,
              firstName: info.profile.firstName,
              lastName: info.profile.lastName,
              orgName: info.profile.orgName,
            })
          );
        }
        resolve();
      });
    });
  }

  deleteAccount(id) {
    Meteor.call('deleteUser', id);
  }
}

angular
  .module('drillApp')
  .service('userService', ['$location', UserService]);

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
