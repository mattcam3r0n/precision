'use strict';

Meteor.methods({
  getUserStats: function(id) {
    return {
      drillCount: Drills.find({ userId: id }).count(),
    };
  },
});
