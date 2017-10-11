'use strict';

Meteor.methods({
  getDrill: function(id) {
    console.log('getDrill', id);
    //return a value
    return Drills.findOne(id);
  }
});