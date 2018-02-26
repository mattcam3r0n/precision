'use strict';

Meteor.users.deny({
  update: function() {
    return true;
  },
});

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
    // eslint-disable-next-line no-invalid-this
    Counts.publish(this, 'numberOfUsers', Meteor.users.find(where), { noReady: true });
    return Meteor.users.find(where, options);
  }
  return null;
});
