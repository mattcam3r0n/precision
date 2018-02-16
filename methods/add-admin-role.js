'use strict';

Meteor.methods({
  addAdminRole: function(id) {
    const isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin');
    if (!isAdmin) {
      if (!isAdmin) {
        throw new Meteor.Error(403, 'Not authorized to change admin role.');
      };
    }

    Roles.addUsersToRoles(id, ['admin']);
    if (this.isSimulation) return;
    Logger.info('Added admin privilege to user ' + id);
  },
});
