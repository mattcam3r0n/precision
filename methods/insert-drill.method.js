'use strict';

Meteor.methods({
  insertDrill: function(drill) {
    drill.createdDate = new Date();
    drill.updatedDate = new Date();
    drill.userId = Meteor.userId(),
    drill.owner = Meteor.user().emails[0].address,
    drill.name_sort = drill.name.toLowerCase();
    return Drills.insert(drill);
  },
});
