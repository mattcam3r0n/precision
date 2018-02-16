'use strict';

Meteor.methods({
  getUserStats: function(id) {
    const user = Meteor.users.findOne(id);
    return {
      drillCount: Drills.find({ userId: id }).count(),
      lastLoginDate: user.profile.lastLoginDate,
      loginCount: user.profile.loginCount,
    };
  },
});
