'use strict';

Meteor.methods({
  getDrill: function(id) {
    // return a value
    return Drills.findOne(id);
  },
});
