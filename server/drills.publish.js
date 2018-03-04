'use strict';

Meteor.publish('drills', function(options, searchText, searchMyDrills, searchSharedDrills) {
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

  const nameConditions = buildNameConditions(searchText);
  const userConditions = buildUserConditions(searchMyDrills,
    searchSharedDrills);
  const where = {
    '$and': [
      { '$or': nameConditions },
      { '$or': userConditions },
    ],
  };

  // eslint-disable-next-line no-invalid-this
  Counts.publish(this, 'numberOfDrills', Drills.find(where), { noReady: true });
  return Drills.find(where, options);
});

function buildNameConditions(searchText) {
  const conditions = [];

  conditions.push({
    'name': {
      '$regex': searchText || '',
      '$options': 'i',
    },
  });

  conditions.push({
    'owner': {
      '$regex': searchText || '',
      '$options': 'i',
    },
  });

  return conditions;
}

function buildUserConditions(searchMyDrills, searchSharedDrills) {
  const isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin');
  const conditions = [];
  // if no options are checked, default to "my drills" only
  if (!searchMyDrills && !searchSharedDrills) {
    conditions.push(
      { 'userId': Meteor.userId() }
    );
  }
  // search my drills, unless explicitly disabled
  if (searchMyDrills) {
    conditions.push(
      { 'userId': Meteor.userId() }
    );
  }
  // allow user to see drills shared with them, if they chose 'sharedWithMe'
  if (!isAdmin && searchSharedDrills) {
    conditions.push(
      { 'sharedWith': Meteor.userId() }
    );
  }
  // allow admins to see all drills, if they chose 'sharedWithMe'
  if (isAdmin && searchSharedDrills) {
    conditions.push(
      { 'userId': { '$ne': Meteor.userId() } }
    );
  }
  return conditions;
}
