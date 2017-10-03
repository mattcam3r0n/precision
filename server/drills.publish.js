'use strict'

Meteor.publish('drills', function(options, searchString) {
  var where = {
    'name': {
      '$regex': '.*' + (searchString || '') + '.*',
      '$options': 'i'
    },
    // limit to users drills. TODO: add publicly shared drills?
    'owner': Meteor.userId()
  };
  Counts.publish(this, 'numberOfDrills', Drills.find(where), {noReady: true});
  return Drills.find(where, options);
});
