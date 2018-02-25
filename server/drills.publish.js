'use strict';

Meteor.publish('drills', function(options, searchText, searchMyDrills, searchSharedDrills) {
  const isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin');
  options = options || {};
  searchMyDrills = searchMyDrills === undefined
    ? true : searchMyDrills;
  searchSharedDrills = searchSharedDrills === undefined
    ? false : searchSharedDrills;
  options.fields = {
    name: 1,
    description: 1,
    userId: 1,
    owner: 1,
    updatedDate: 1,
  };
console.log({
  searchText: searchText,
  searchMyDrills: searchMyDrills,
  searchSharedDrills: searchSharedDrills,
});
  let where = {
    'name': {
//      '$regex': '.*' + (searchString || '') + '.*',
      '$regex': searchText || '',
      '$options': 'i',
    },
    '$or': [
    ],
  };
  // if no options are checked, default to "my drills" only
  if (!searchMyDrills && !searchSharedDrills) {
    where.$or.push(
      { 'userId': Meteor.userId() }
    );
  }
  // search my drills, unless explicitly disabled
  if (searchMyDrills) {
    where.$or.push(
      { 'userId': Meteor.userId() }
    );
  }
  // allow user to see drills shared with them, if they chose 'sharedWithMe'
  if (!isAdmin && searchSharedDrills) {
    where.$or.push(
      { 'sharedWith': Meteor.userId() }
    );
  }
  // allow admins to see all drills, if they chose 'sharedWithMe'
  if (isAdmin && searchSharedDrills) {
    where.$or.push(
      { 'userId': { '$ne': Meteor.userId() } }
    );
  }

console.log(where);

  // eslint-disable-next-line no-invalid-this
  Counts.publish(this, 'numberOfDrills', Drills.find(where), {noReady: true});
  return Drills.find(where, options);
});
