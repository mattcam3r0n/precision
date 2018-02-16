'use strict';

Meteor.methods({
  updateLoginStats: function(id) {
    Meteor.users.update({
      _id: id,
    }, {
      $set: {
        'profile.lastLoginDate': new Date(),
      },
      $inc: {
        'profile.loginCount': 1,
      },
    });
  },
});
