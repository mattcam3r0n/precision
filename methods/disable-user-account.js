'use strict';

Meteor.methods({
  disableUserAccount: function(id) {
    const isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin');
    if (!isAdmin) {
        throw new Meteor.Error(403, 'Not authorized to disable user account.');
    };

    Roles.addUsersToRoles(id, ['disabled']);
    if (this.isSimulation) return;
    Logger.info('User ' + id + ' disabled by admin.');
  },
});
