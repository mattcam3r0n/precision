'use strict';

Meteor.methods({
  removeAdminRole: function(id) {
    const isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin');
    if (!isAdmin) {
      throw new Meteor.Error(403, 'Not authorized to change admin role.');
    };

    Roles.removeUsersFromRoles(id, ['admin']);
  },
});
