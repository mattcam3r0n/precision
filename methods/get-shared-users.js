'use strict';

Meteor.methods({
  getSharedUsers: function(id) {
    const drill = Drills.findOne(id);
    if (!drill.sharedWith) return [];

    return drill.sharedWith.map((userId) => {
      return Meteor.users.findOne(userId);
    });
  },
});
