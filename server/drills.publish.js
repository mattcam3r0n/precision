'use strict';

Meteor.publish('drills', function(options, searchString) {
  options = options || {};
  options.fields = {
    name: 1,
    description: 1,
    userId: 1,
    owner: 1,
    updatedDate: 1,
  };
  let where = {
    'name': {
//      '$regex': '.*' + (searchString || '') + '.*',
      '$regex': searchString || '',
      '$options': 'i',
    },
    // limit to users drills. TODO: add publicly shared drills?
    'userId': Meteor.userId(),
  };
  // eslint-disable-next-line no-invalid-this
  Counts.publish(this, 'numberOfDrills', Drills.find(where), {noReady: true});
  return Drills.find(where, options);
});
