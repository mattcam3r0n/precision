'use strict';

Meteor.methods({
  enableUserAccount: function(id) {
    const isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin');
    if (!isAdmin) {
        throw new Meteor.Error(403, 'Not authorized to enable user account.');
    };

    Roles.removeUsersFromRoles(id, ['disabled']);
  },
});
