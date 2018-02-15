'use strict';

Meteor.publish('users', function(options, searchString) {
  // const user = Meteor.user();

  // TODO: add roles check
  if (true) {
    let where = {
      '$or': [
        {
          'profile.orgName': {
            '$regex': searchString || '',
            '$options': 'i',
          },
        },
        {
          'profile.firstName': {
            '$regex': searchString || '',
            '$options': 'i',
          },
        },
        {
          'profile.lastName': {
            '$regex': searchString || '',
            '$options': 'i',
          },
        },
      ],
    };
    console.log(searchString, where.$or, options);
    return Meteor.users.find(where, options);
  }
  return null;
});
