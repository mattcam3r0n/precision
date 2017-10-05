'use strict'

Meteor.publish('drills', function(options, searchString) {
  var where = {
    'name': {
//      '$regex': '.*' + (searchString || '') + '.*',
      '$regex': searchString || '',
      '$options': 'i'
    },
    // limit to users drills. TODO: add publicly shared drills?
    'userId': Meteor.userId()
  };
  console.log(where);
  Counts.publish(this, 'numberOfDrills', Drills.find(where), {noReady: true});
  return Drills.find(where, options);
});


// Meteor.publish('drills', function(options, searchString) {
//   var where = {
//     'name': {
//       '$regex': '.*' + (searchString || '') + '.*',
//       '$options': 'i'
//     },
//     // limit to users drills. TODO: add publicly shared drills?
//     //'owner': Meteor.userId()
//   };

// console.log(searchString, where);

//   Counts.publish(this, 'numberOfDrills', Drills.find(where), {noReady: true});
//   return Drills.find(where, options);
// });
