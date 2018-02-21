'use strict';

Meteor.methods({
  updateDrill: function(drill) {
    drill.updatedDate = new Date();
    drill.name_sort = drill.name.toLowerCase();
    drill.userId = Meteor.userId();
    drill.owner = Meteor.user().emails[0].address;
    Drills.update({
        _id: drill._id,
    }, {
        $set: drill,
    });
  },
});
